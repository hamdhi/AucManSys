using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            var user = dbContext.userAuths
                .FirstOrDefault(u => u.Username == loginDto.Username
                                  && u.PasswordHash == loginDto.Password); // in real app, hash check

            if (user == null)
                return Unauthorized("Invalid username or password");

            if (!user.IsActive)
                return Forbid("User account is inactive");

            // Update last login time
            user.LastLogin = DateTime.Now;
            dbContext.SaveChanges();

            // Return panel info based on role
            switch (user.Role)
            {
                case "Admin":
                    return Ok(new { message = "Login successful", panel = "Admin Panel" });
                case "Seller":
                    return Ok(new { message = "Login successful", panel = "Seller Panel" });
                case "Bidder":
                    return Ok(new { message = "Login successful", panel = "Bidder Panel" });
                default:
                    return Ok(new { message = "Login successful", panel = "Unknown Role" });
            }
        }
    }
}
