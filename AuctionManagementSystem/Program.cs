using AuctionManagementSystem.Data;
using AuctionManagementSystem.Services;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHostedService<AutoBidService>();
// Set QuestPDF license
QuestPDF.Settings.License = LicenseType.Community;  // ✅ here
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
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
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ since you're using https
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});



var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseSession(); // enable session

app.UseAuthorization();

app.MapControllers();

app.Run();
