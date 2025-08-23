using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        // Constructor injection for ApplicationDbContext
        public UserAuthController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("getAll")]
        public IActionResult GetAllUsers()
        {
            var Users = dbContext.userAuths.ToList();
            return Ok(Users);
        }

        [HttpPost("Add")]
        public IActionResult AddAuthUsers(AddUserAuthDto addUserAuthDto) 
        {
            var UserAuthEntitie = new UserAuth() {
                UserId = Guid.NewGuid(),                       // generate unique ID
                Username = addUserAuthDto.Username,            // from DTO
                Email = addUserAuthDto.Email,                  // from DTO
                PasswordHash = addUserAuthDto.PasswordHash,    // hashed password from DTO
                Role = addUserAuthDto.Role,                    // Admin / Seller / Bidder
                CreatedAt = DateTime.Now,                      // current time
                LastLogin = DateTime.Now,                      // new user hasn't logged in yet
                IsActive = true                                // set account as active
            };
            dbContext.userAuths.Add(UserAuthEntitie);
            dbContext.SaveChanges();

            return Ok("added");
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateUser(Guid id, AddUserAuthDto updateDto)
        {
            var user = dbContext.userAuths.FirstOrDefault(u => u.UserId == id);
            if (user == null)
                return NotFound("User not found");

            user.Username = updateDto.Username;
            user.Email = updateDto.Email;
            user.PasswordHash = updateDto.PasswordHash;
            user.Role = updateDto.Role;
            user.LastLogin = DateTime.Now;
            user.IsActive = updateDto.IsActive;

            dbContext.SaveChanges();
            return Ok("updated");
        }

        // DELETE: Remove a user
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteUser(Guid id)
        {
            var user = dbContext.userAuths.FirstOrDefault(u => u.UserId == id);
            if (user == null)
                return NotFound("User not found");

            dbContext.userAuths.Remove(user);
            dbContext.SaveChanges();
            return Ok("deleted");
        }


        [HttpGet("getById/{id}")]
        public IActionResult GetUserById(Guid id)
        {
            var user = dbContext.userAuths.FirstOrDefault(u => u.UserId == id);
            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

    }
}
