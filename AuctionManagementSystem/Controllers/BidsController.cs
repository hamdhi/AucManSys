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

        //singleton is used internally by the entity framework core
        private readonly ApplicationDbContext _db;
        public BidsController(ApplicationDbContext db)
        {
            _db = db;
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddBid([FromBody] AddBidDto dto)
        {
            if (dto == null) return BadRequest("Request body is empty or invalid.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var product = await _db.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound("Product not found");

            // ✅ Get logged-in user from session
            var userIdStr = HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized("User not logged in");

            var userId = Guid.Parse(userIdStr);
            var user = await _db.userAuths.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            // ✅ Check bid amount client/server side
            if (dto.BidAmount <= product.Min_Bid_Price)
                return BadRequest("Bid must be higher than current minimum bid");

            if (DateTime.Now >= product.End_Date)
                return BadRequest("Auction already ended, cannot place bid");

            var bid = new Bid
            {
                ProductId = dto.ProductId,
                UserId = user.UserId,
                BidAmount = dto.BidAmount,
                BidTime = DateTime.UtcNow
            };

            product.Min_Bid_Price = dto.BidAmount; // update min bid
            _db.Bids.Add(bid);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Bid placed successfully!",
                bidId = bid.BidId,
                productId = bid.ProductId,
                userId = bid.UserId,
                bidAmount = bid.BidAmount,
                bidTime = bid.BidTime,
                username = user.Username
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
