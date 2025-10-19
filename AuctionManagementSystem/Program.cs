using AuctionManagementSystem.Data;
using AuctionManagementSystem.Services;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;
using Microsoft.OpenApi.Models;
using System.Diagnostics;


//var url = "http://localhost:7212";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Register Swagger services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AuctionManagementSystem API", Version = "v1" });
});


builder.Services.AddHostedService<AutoBidService>();
// Set QuestPDF license
QuestPDF.Settings.License = LicenseType.Community;  // ✅ here
// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5000", "http://localhost:5500", "http://127.0.0.1:5500") // your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                .AllowCredentials(); // ✅ allow cookies/session
        });
}   );

// Add session support
builder.Services.AddDistributedMemoryCache(); // in-memory session
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None; // ✅ required for cross-origin
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ since  using https
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

//email Add This
builder.Services.AddTransient<IEmailService,EmailService>();


var app = builder.Build();

// Enable middleware to serve generated Swagger as a JSON endpoint.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    // Enable middleware to serve Swagger UI (HTML, JS, CSS, etc.),
    // specifying the Swagger JSON endpoint.
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuctionManagementSystem API v1");
    });
}

app.UseDefaultFiles();    // serves index.html automatically

// Map API routes
app.MapControllers();

//file Management for Photos
app.UseStaticFiles(); 


// Use CORS
app.UseCors("AllowFrontend");


//app.UseHttpsRedirection();

app.UseSession(); // enable session

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html"); // important for React routes

app.Run();
