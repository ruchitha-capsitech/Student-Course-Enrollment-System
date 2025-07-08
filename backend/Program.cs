using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Student_course_enrollment.Services;
using Student_course_enrollment.Models;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Bind DatabaseSettings from appsettings.json
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Register as interface to allow loose coupling
builder.Services.AddSingleton<IMongoDbSettings>(sp =>
    sp.GetRequiredService<IOptions<MongoDbSettings>>().Value);

// Register application services
builder.Services.AddSingleton<StudentService>();
builder.Services.AddSingleton<CourseService>();
builder.Services.AddSingleton<EnrollmentService>();
builder.Services.AddSingleton<UserService>();

// Add controllers
builder.Services.AddControllers();

// Register Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Allow any origin (you can restrict this later for production)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Enable Swagger UI in development only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAll");

// Use Authorization (you can add Authentication later if needed)
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Run the application
app.Run();




// ﻿using Course_course_enrollment.Services;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using MongoDB.Driver;
// using Student_course_enrollment.Models;
// using Student_course_enrollment.Services;
// using System.Text;

// var builder = WebApplication.CreateBuilder(args);

// //  JWT Configuration
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     var jwtSettings = builder.Configuration.GetSection("JwtSettings");
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidateLifetime = true,
//         ValidateIssuerSigningKey = true,
//         ValidIssuer = jwtSettings["Issuer"],
//         ValidAudience = jwtSettings["Audience"],
//         IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
//     };
// });

// builder.Services.AddAuthorization();

// //  MongoDB Configuration
// builder.Services.Configure<MongoDbSettings>(
//     builder.Configuration.GetSection("MongoDB"));

// var mongoSettings = builder.Configuration.GetSection("MongoDB").Get<MongoDbSettings>();

// builder.Services.AddSingleton<IMongoClient>(sp =>
//     new MongoClient(mongoSettings!.ConnectionString));

// builder.Services.AddScoped<IMongoDatabase>(sp =>
//     sp.GetRequiredService<IMongoClient>().GetDatabase(mongoSettings!.DatabaseName));

// //  Application Services
// builder.Services.AddScoped<UserService>();
// builder.Services.AddScoped<StudentService>();
// builder.Services.AddScoped<CourseService>();
// builder.Services.AddScoped<EnrollmentService>();
// builder.Services.AddSingleton<TokenService>();

// // Framework Services
// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

// var app = builder.Build();

// //  Middleware Pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();
// app.UseCors("AllowAll");
// app.UseAuthentication();
// app.UseAuthorization();
// app.MapControllers();
// app.Run();
