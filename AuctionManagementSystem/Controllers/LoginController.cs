using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        // Inject the DbContext directly
        public LoginController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var user = dbContext.userAuths
                .FirstOrDefault(u => u.Username == loginDto.Username
                                  && u.PasswordHash == loginDto.Password); // in real app, hash check

            if (user == null)
                return Unauthorized("Invalid username or password");

            if (!user.IsActive)
                return Forbid("User account is inactive");

            // Save role in session
            HttpContext.Session.SetString("UserId", user.UserId.ToString());
            HttpContext.Session.SetString("UserRole", user.Role);
            HttpContext.Session.SetString("UserName", user.Username);


            // Update last login time
            user.LastLogin = DateTime.Now;
            dbContext.SaveChanges();

            // Return panel info based on role
            return Ok(new
            {
                message = "Login successful",
                panel = user.Role + " Panel",
                username = user.Username  // Sending The Username to frontend
            });
        }
    }
}


/*
  
  check session on other endpoints
 
 [HttpGet("dashboard")]
public IActionResult Dashboard()
{
    var role = HttpContext.Session.GetString("UserRole");
    if (string.IsNullOrEmpty(role))
        return Unauthorized("Not logged in");

    return Ok($"Welcome to {role} Dashboard");
}

 */