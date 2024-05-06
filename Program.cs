using GateEntryExit.DatabaseContext;
using GateEntryExit.Domain;
using GateEntryExit.Domain.Manager;
using GateEntryExit.Domain.Policy;
using GateEntryExit.Helper;
using GateEntryExit.Repositories;
using GateEntryExit.Repositories.Interfaces;
using GateEntryExit.Service.Cache;
using GateEntryExit.Service.Token;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Exceptions;
using Serilog.Sinks.Elasticsearch;
using System;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var JWTSetting = builder.Configuration.GetSection("JWTSetting");

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// https://stackoverflow.com/questions/56234504/bearer-authentication-in-swagger-ui-when-migrating-to-swashbuckle-aspnetcore-ve
builder.Services.AddSwaggerGen(c => {
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization Example : 'Bearer sd23r43ffdhg545",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement(){
        {
            new OpenApiSecurityScheme{
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "outh2",
                Name="Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });

});

// 4200 - Angular
// 5189 - MVC
// 81 - JavaScript (IIS hosted)

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policyBuilder =>
                      {
                          policyBuilder.WithOrigins("http://localhost:4200", "http://localhost:5189", "http://localhost:81");
                          policyBuilder.AllowAnyHeader();
                          policyBuilder.AllowAnyMethod();
                      });
});

builder.Services.AddDbContext<GateEntryExitDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddIdentity<AppUser, IdentityRole>().AddEntityFrameworkStores<GateEntryExitDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddTransient<IGateRepository, GateRepository>();
builder.Services.AddTransient<IGateManager, GateManager>();

builder.Services.AddTransient<IGateEntryRepository, GateEntryRepository>();
builder.Services.AddTransient<IGateEntryManager, GateEntryManager>();

builder.Services.AddTransient<IGateExitRepository, GateExitRepository>();
builder.Services.AddTransient<IGateExitManager, GateExitManager>();

builder.Services.AddTransient<ISensorRepository, SensorRepository>();
builder.Services.AddTransient<ISensorManager, SensorManager>();

builder.Services.AddTransient<IGateNameUniquePolicy, GateNameUniquePolicy>();

builder.Services.AddTransient<IGuidGenerator, GuidGenerator>();

builder.Services.AddTransient<ICacheService, CacheService>();
builder.Services.AddTransient<ITokenService, TokenService>();

// Serilog
configureLogging();
builder.Host.UseSerilog();

// JWT
// https://code-maze.com/authentication-aspnetcore-jwt-1/
builder.Services.AddAuthentication(opt => {
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opt => {
    opt.SaveToken = true;
    opt.RequireHttpsMetadata = false;
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = JWTSetting["ValidAudience"],
        ValidIssuer = JWTSetting["ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTSetting.GetSection("securityKey").Value!))
    };
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();

void configureLogging()
{
    var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
    var configuration = new ConfigurationBuilder()
                        .AddJsonFile(path: "appsettings.json", optional: false, reloadOnChange: true)
                        .AddJsonFile(path: $"appsettings.{environment}.json", optional: true)
                        .Build();

    Log.Logger = new LoggerConfiguration()
                 .Enrich.FromLogContext()
                 .Enrich.WithExceptionDetails()
                 .WriteTo.Debug()
                 .WriteTo.Console()
                 .WriteTo.Elasticsearch(configureElasticSink(configuration, environment))
                 .Enrich.WithProperty("Environment", environment)
                 .ReadFrom.Configuration(configuration)
                 .CreateLogger();
}

ElasticsearchSinkOptions configureElasticSink(IConfigurationRoot configuration, string environment)
{
    return new ElasticsearchSinkOptions(new Uri(configuration["ElasticConfiguration:Uri"]))
    {
        AutoRegisterTemplate = true,
        IndexFormat = $"{Assembly.GetExecutingAssembly().GetName().Name.ToLower().Replace(".","-")}-{environment.ToLower()}-{DateTime.UtcNow:yyyy-MM}",
        NumberOfReplicas = 1,
        NumberOfShards = 2
    };
}
