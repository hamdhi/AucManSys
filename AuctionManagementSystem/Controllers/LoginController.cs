using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public LoginController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            // Only check username first, NOT password
            var user = dbContext.userAuths
                .FirstOrDefault(u => u.Username == loginDto.Username);

            if (user == null)
                return Unauthorized("Invalid username or password");

            if (!user.IsActive)
                return Forbid("User account is inactive");

            // BCrypt verification
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

            if (!isPasswordValid)
                return Unauthorized("Invalid username or password");

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
                username = user.Username
            });
        }
    }
}