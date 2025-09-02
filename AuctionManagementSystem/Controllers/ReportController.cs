using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public ReportController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("auction/{id}")]
        public IActionResult GetAuctionReport(int id)
        {
            // 1️⃣ Fetch product
            var product = dbContext.Products.FirstOrDefault(p => p.Product_Id == id);
            if (product == null) return NotFound("Auction not found");

            // 2️⃣ Fetch bids
            var bids = dbContext.Bids
                .Where(b => b.ProductId == id)
                .Select(b => new BidDto
                {
                    BidId = b.BidId,
                    UserId = b.UserId.ToString() ?? "Unknown",  // ensure not null
                    BidAmount = b.BidAmount,
                    BidTime = b.BidTime
                })
                .ToList();

            // 3️⃣ Map to DTO and prevent nulls
            var auctionDto = new AuctionReportDto
            {
                Product_Id = product.Product_Id,
                Product_Name = product.Product_Name ?? "N/A",
                Description = product.Description ?? "",
                Min_Bid_Price = product.Min_Bid_Price,
                Start_Date = product.Start_Date,
                End_Date = product.End_Date,
                Bids = bids ?? new List<BidDto>()
            };

            // 4️⃣ Generate PDF safely
            MemoryStream stream;
            try
            {
                stream = new MemoryStream();
                Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Margin(30);
                        page.Header().Text($"Auction Report - {auctionDto.Product_Name}").FontSize(20).Bold();
                        page.Content().Column(col =>
                        {
                            col.Item().Text($"Description: {auctionDto.Description}");
                            col.Item().Text($"Min Bid: {auctionDto.Min_Bid_Price}");
                            col.Item().Text($"Start Date: {auctionDto.Start_Date:yyyy-MM-dd HH:mm}");
                            col.Item().Text($"End Date: {auctionDto.End_Date:yyyy-MM-dd HH:mm}");

                            col.Item().Text("Bids:").Bold();
                            if (!auctionDto.Bids.Any())
                            {
                                col.Item().Text("No bids yet.");
                            }
                            else
                            {
                                foreach (var bid in auctionDto.Bids)
                                {
                                    col.Item().Text($"{bid.UserId} - {bid.BidAmount} at {bid.BidTime:yyyy-MM-dd HH:mm}");
                                }
                            }
                        });
                    });
                }).GeneratePdf(stream); // write to stream
            }
            catch (Exception ex)
            {
                return BadRequest("PDF generation failed: " + ex.Message);
            }

            // 5️⃣ Return PDF
            stream.Position = 0;
            return File(stream, "application/pdf", $"AuctionReport_{auctionDto.Product_Id}.pdf");
        }



        [HttpGet("monthly/{year}/{month}")]
        public IActionResult GetMonthlyReport(int year, int month)
        {
            // 1️⃣ Get all products for the given month
            var products = dbContext.Products
                .Where(p => p.Start_Date.Year == year && p.Start_Date.Month == month)
                .ToList();

            if (!products.Any())
                return NotFound("No auctions found for this month.");

            // 2️⃣ Map products and their bids
            var reportData = products.Select(p => new AuctionReportDto
            {
                Product_Id = p.Product_Id,
                Product_Name = p.Product_Name ?? "N/A",
                Description = p.Description ?? "",
                Min_Bid_Price = p.Min_Bid_Price,
                Start_Date = p.Start_Date,
                End_Date = p.End_Date,
                Bids = dbContext.Bids
                    .Where(b => b.ProductId == p.Product_Id)
                    .Select(b => new BidDto
                    {
                        BidId = b.BidId,
                        UserId = b.UserId.ToString() ?? "Unknown",
                        BidAmount = b.BidAmount,
                        BidTime = b.BidTime
                    })
                    .ToList()
            }).ToList();

            // 3️⃣ Generate PDF
            MemoryStream stream;
            try
            {
                stream = new MemoryStream();
                Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Margin(30);
                        page.Header().Text($"Monthly Auction Report - {month}/{year}").FontSize(20).Bold();
                        page.Content().Column(col =>
                        {
                            foreach (var auction in reportData)
                            {
                                col.Item().Text($"Product: {auction.Product_Name}").FontSize(16).Bold();
                                col.Item().Text($"Description: {auction.Description}");
                                col.Item().Text($"Min Bid: {auction.Min_Bid_Price}");
                                col.Item().Text($"Start Date: {auction.Start_Date:yyyy-MM-dd HH:mm}");
                                col.Item().Text($"End Date: {auction.End_Date:yyyy-MM-dd HH:mm}");

                                col.Item().Text("Bids:").Bold();
                                if (!auction.Bids.Any())
                                {
                                    col.Item().Text("No bids yet.");
                                }
                                else
                                {
                                    foreach (var bid in auction.Bids)
                                    {
                                        col.Item().Text($"{bid.UserId} - {bid.BidAmount} at {bid.BidTime:yyyy-MM-dd HH:mm}");
                                    }
                                }

                                col.Item().LineHorizontal(1); // line between products
                                col.Item().Padding(5);
                            }
                        });
                    });
                }).GeneratePdf(stream);
            }
            catch (Exception ex)
            {
                return BadRequest("PDF generation failed: " + ex.Message);
            }

            // 4️⃣ Return PDF
            stream.Position = 0;
            return File(stream, "application/pdf", $"MonthlyReport_{year}_{month}.pdf");
        }

    }
}
