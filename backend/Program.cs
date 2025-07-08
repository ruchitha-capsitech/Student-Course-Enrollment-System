using Course_course_enrollment.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Student_course_enrollment.Models;
using Student_course_enrollment.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Allow listening on dynamic port (Render requires this)
builder.WebHost.UseUrls($"http://0.0.0.0:{Environment.GetEnvironmentVariable("PORT") ?? "5000"}");

// JWT Authentication Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
    };
});

builder.Services.AddAuthorization();

// MongoDB Configuration from Environment Variables
var mongoConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING");
var mongoDatabaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME");

builder.Services.AddSingleton<IMongoClient>(sp =>
    new MongoClient(mongoConnectionString));

builder.Services.AddScoped<IMongoDatabase>(sp =>
    sp.GetRequiredService<IMongoClient>().GetDatabase(mongoDatabaseName));

// Application Services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<CourseService>();
builder.Services.AddScoped<EnrollmentService>();
builder.Services.AddSingleton<TokenService>();

// Framework Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for Vercel Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://student-course-enrollment-system-eta.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Optional: Seed admin user on first deploy
using (var scope = app.Services.CreateScope())
{
    var userService = scope.ServiceProvider.GetRequiredService<UserService>();
    var adminExists = await userService.GetByUsernameAsync("admin");

    if (adminExists == null)
    {
        await userService.CreateAsync(new User
        {
            Username = "admin",
            Password = "admin123"
        });
        Console.WriteLine("✅ Default admin user created.");
    }
}

// Middleware Pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

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
