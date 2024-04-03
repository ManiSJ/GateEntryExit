using GateEntryExit.DatabaseContext;
using GateEntryExit.Domain.Manager;
using GateEntryExit.Domain.Policy;
using GateEntryExit.Helper;
using GateEntryExit.Repositories;
using GateEntryExit.Repositories.Interfaces;
using GateEntryExit.Service;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => options.WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.Run();
