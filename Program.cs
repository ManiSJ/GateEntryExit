using GateEntryExit.DatabaseContext;
using GateEntryExit.Domain.Manager;
using GateEntryExit.Domain.Policy;
using GateEntryExit.Helper;
using GateEntryExit.Repositories;
using GateEntryExit.Repositories.Interfaces;
using GateEntryExit.Service;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Exceptions;
using Serilog.Sinks.Elasticsearch;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GateEntryExitDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

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

configureLogging();
builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => options.WithOrigins("http://localhost:4200", "http://localhost:5189")
    .AllowAnyMethod()
    .AllowAnyHeader());

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
