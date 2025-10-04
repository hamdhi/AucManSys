using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        // Inject the DbContext directly
        public CategoryController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Category/getAll
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            var categories = await dbContext.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/Category/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await dbContext.Categories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found.");
            return Ok(category);
        }

        // POST: api/Category/add
        [HttpPost("add")]
        public async Task<ActionResult<Category>> AddCategory([FromBody] Category category)
        {
            if (string.IsNullOrEmpty(category.Cat_Name))
                return BadRequest("Category name is required.");

            dbContext.Categories.Add(category);
            await dbContext.SaveChangesAsync();
            return Ok(category);
        }

        // PUT: api/Category/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            if (id != category.Cat_Id)
                return BadRequest("ID mismatch.");

            var existingCategory = await dbContext.Categories.FindAsync(id);
            if (existingCategory == null)
                return NotFound("Category not found.");

            existingCategory.Cat_Name = category.Cat_Name;
            await dbContext.SaveChangesAsync();
            return Ok(existingCategory);
        }

        // DELETE: api/Category/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await dbContext.Categories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found.");

            dbContext.Categories.Remove(category);
            await dbContext.SaveChangesAsync();
            return Ok("Category deleted successfully.");
        }
    }
}
