using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BidsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public BidsController(ApplicationDbContext db) => _db = db;

        // ✅ POST: api/Bids/add
        [HttpPost("add")]
        public async Task<IActionResult> AddBid([FromBody] AddBidDto dto)
        {
            if (dto == null)
                return BadRequest("Request body is empty or invalid.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ✅ validate product
            var product = await _db.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound("Product not found");

            // ✅ Example: get logged-in user (for now, pick first user or mock user)
            // Later: replace with actual User.Identity or session
            var user = await _db.userAuths.FirstOrDefaultAsync();
            if (user == null) return NotFound("User not found");

            // ✅ create bid
            var bid = new Bid
            {
                ProductId = dto.ProductId,
                UserId = user.UserId,   // comes from DB
                BidAmount = dto.BidAmount,
                BidTime = DateTime.UtcNow
            };

            // ✅ update product min bid
            product.Min_Bid_Price = dto.BidAmount;

            _db.Bids.Add(bid);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Bid placed successfully!",
                bidId = bid.BidId,
                productId = bid.ProductId,
                userId = bid.UserId,
                bidAmount = bid.BidAmount,
                bidTime = bid.BidTime
            });
        }

        [HttpGet("getByProduct/{productId}")]
        public async Task<IActionResult> GetBidsByProduct(int productId)
        {
            var bids = await _db.Bids
                .Include(b => b.UserAuth)  // include user info
                .Include(b => b.Product)  // ✅ include Product too
                .Where(b => b.ProductId == productId)
                .OrderByDescending(b => b.BidAmount)
                .ToListAsync();

            var result = bids.Select(b => new
            {
                b.BidId,
                b.ProductId,
                ProductName = b.Product.Product_Name,
                b.UserId,
                Username = b.UserAuth.Username, // include username
                b.BidAmount,
                b.BidTime
            });

            return Ok(result);
        }


        // ✅ GET all bids
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllBids()
        {
            var bids = await _db.Bids
                .Include(b => b.Product)
                .Include(b => b.UserAuth)
                .ToListAsync();

            var result = bids.Select(b => new
            {
                b.BidId,
                b.ProductId,
                ProductName = b.Product.Product_Name,
                b.UserId,
                Username = b.UserAuth.Username,
                b.BidAmount,
                b.BidTime
            });

            return Ok(result);
        }
    }
}
