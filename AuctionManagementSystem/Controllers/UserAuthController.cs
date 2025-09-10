using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public UserAuthController(DbContextOptions<ApplicationDbContext> options) => _db = ApplicationDbContext.GetInstance(options);

        // GET: api/UserAuth/getAll
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _db.userAuths
                .Select(u => new {
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.CreatedAt,
                    u.LastLogin,
                    u.IsActive
                }).ToListAsync();

            return Ok(users);
        }

        // POST: api/UserAuth/add
        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] AddUserAuthDto dto)
        {
            var user = new UserAuth
            {
                UserId = Guid.NewGuid(),
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash,
                Role = dto.Role,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.Now
            };
            _db.userAuths.Add(user);
            await _db.SaveChangesAsync();
            return Ok(user);
        }

        // PUT: api/UserAuth/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserAuthDto dto)
        {
            var user = await _db.userAuths.FindAsync(id);
            if (user == null) return NotFound("User not found");

            user.Username = dto.Username; // allow changing
            user.Email = dto.Email;
            user.Role = dto.Role;
            user.IsActive = dto.IsActive;

            // Update password only if provided
            if (!string.IsNullOrWhiteSpace(dto.PasswordHash))
                user.PasswordHash = dto.PasswordHash;

            await _db.SaveChangesAsync();
            return Ok(user);
        }

        // DELETE: api/UserAuth/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _db.userAuths.FindAsync(id);
            if (user == null) return NotFound("User not found");

            _db.userAuths.Remove(user);
            await _db.SaveChangesAsync();
            return Ok("Deleted successfully");
        }

        // GET: api/UserAuth/getById/{id}
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _db.userAuths
                .Where(u => u.UserId == id)
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.IsActive
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }
    }
}
