
using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionManagementSystem.Services
{
    public class AutoBidService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public AutoBidService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var activeProducts = await db.Products
                        .Where(p => p.End_Date > DateTime.Now) // still active
                        .ToListAsync(stoppingToken);

                    foreach (var product in activeProducts)
                    {
                        // find last bid
                        var lastBid = await db.Bids
                            .Where(b => b.ProductId == product.Product_Id)
                            .OrderByDescending(b => b.BidTime)
                            .FirstOrDefaultAsync(stoppingToken);

                        if (lastBid != null)
                        {
                            var timePassed = DateTime.Now - lastBid.BidTime;

                            if (timePassed.TotalMinutes >= 30)
                            {
                                // Auto increase by +1
                                var newBid = new Bid
                                {
                                    ProductId = product.Product_Id,
                                    UserId = lastBid.UserId, // 👈 you can change to system user if needed
                                    BidAmount = lastBid.BidAmount + 1,
                                    BidTime = DateTime.Now
                                };

                                product.Min_Bid_Price = newBid.BidAmount;
                                db.Bids.Add(newBid);

                                await db.SaveChangesAsync(stoppingToken);
                            }
                        }
                    }
                }

                // wait 20 minutes before next check
                await Task.Delay(TimeSpan.FromMinutes(20), stoppingToken);
            }
        }
    }
}
