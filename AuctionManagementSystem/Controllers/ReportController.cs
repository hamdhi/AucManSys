using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public ReportController(DbContextOptions<ApplicationDbContext> options)
        {
            dbContext = ApplicationDbContext.GetInstance(options);
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
                        page.Header()
                            .Text($"Auction Report - {auctionDto.Product_Name}")
                            .FontSize(22)
                            .Bold()
                            .FontColor(Colors.Blue.Medium);

                        page.Content().Column(col =>
                        {
                            col.Spacing(5);

                            // Product info in a styled section
                            col.Item().Background(Colors.Grey.Lighten3).Padding(10).Column(info =>
                            {
                                info.Item().Text($"Description: {auctionDto.Description}")
                                    .FontSize(12).FontColor(Colors.Black);
                                info.Item().Text($"Min Bid: {auctionDto.Min_Bid_Price}")
                                    .FontColor(Colors.Green.Darken2).Bold();
                                info.Item().Text($"Start Date: {auctionDto.Start_Date:yyyy-MM-dd HH:mm}");
                                info.Item().Text($"End Date: {auctionDto.End_Date:yyyy-MM-dd HH:mm}");
                            });

                            col.Item().PaddingTop(10);

                            // Bids section
                            col.Item().Text("Bids:").FontSize(16).Bold().Underline();

                            if (!auctionDto.Bids.Any())
                            {
                                col.Item().Text("No bids yet.")
                                    .Italic()
                                    .FontColor(Colors.Red.Medium);
                            }
                            else
                            {
                                col.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.ConstantColumn(100); // UserId column
                                        columns.RelativeColumn();    // BidAmount
                                        columns.RelativeColumn();    // BidTime
                                    });

                                    // Table header
                                    table.Header(header =>
                                    {
                                        header.Cell().Element(CellStyle).Text("User").Bold();
                                        header.Cell().Element(CellStyle).Text("Bid Amount").Bold();
                                        header.Cell().Element(CellStyle).Text("Time").Bold();
                                    });

                                    // Table rows
                                    foreach (var bid in auctionDto.Bids)
                                    {
                                        table.Cell().Element(CellStyle).Text(bid.UserId);
                                        table.Cell().Element(CellStyle).Text(bid.BidAmount.ToString());
                                        table.Cell().Element(CellStyle).Text($"{bid.BidTime:yyyy-MM-dd HH:mm}");
                                    }

                                    static IContainer CellStyle(IContainer container) =>
                                        container.Border(0.5f).BorderColor(Colors.Grey.Medium).Padding(5);
                                });
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
                        page.Margin(40);

                        // Header
                        page.Header().BorderBottom(1).PaddingBottom(10).AlignCenter().Text($"📊 Monthly Auction Report - {month}/{year}")
                            .FontSize(22).Bold().FontColor("#2C3E50");

                        // Content
                        page.Content().Column(col =>
                        {
                            foreach (var auction in reportData)
                            {
                                col.Item().Border(1).BorderColor("#D5DBDB").Padding(10).Background("#F8F9F9").Column(inner =>
                                {
                                    inner.Item().Text($"📦 Product: {auction.Product_Name}")
                                        .FontSize(16).Bold().FontColor("#1A5276");

                                    inner.Item().Text($"📝 Description: {auction.Description}")
                                        .FontSize(12).FontColor("#34495E");

                                    inner.Item().Text($"💰 Min Bid: {auction.Min_Bid_Price}")
                                        .FontSize(12).FontColor("#27AE60");

                                    inner.Item().Text($"📅 Start Date: {auction.Start_Date:yyyy-MM-dd HH:mm}")
                                        .FontSize(12);

                                    inner.Item().Text($"⏰ End Date: {auction.End_Date:yyyy-MM-dd HH:mm}")
                                        .FontSize(12).FontColor("#C0392B");

                                    inner.Item().PaddingTop(5).Text("🔨 Bids:").Bold().FontSize(13);

                                    if (!auction.Bids.Any())
                                    {
                                        inner.Item().Text("❌ No bids yet.").Italic().FontColor("#7D3C98");
                                    }
                                    else
                                    {
                                        inner.Item().Table(table =>
                                        {
                                            table.ColumnsDefinition(cols =>
                                            {
                                                cols.RelativeColumn(2); // User
                                                cols.RelativeColumn(1); // Amount
                                                cols.RelativeColumn(2); // Time
                                            });

                                            table.Header(header =>
                                            {
                                                header.Cell().Text("User").Bold().FontColor("#154360");
                                                header.Cell().Text("Bid Amount").Bold().FontColor("#154360");
                                                header.Cell().Text("Bid Time").Bold().FontColor("#154360");
                                            });

                                            foreach (var bid in auction.Bids)
                                            {
                                                table.Cell().Text(bid.UserId.ToString());
                                                table.Cell().Text($"{bid.BidAmount}");
                                                table.Cell().Text($"{bid.BidTime:yyyy-MM-dd HH:mm}");
                                            }
                                        });
                                    }
                                });

                                col.Item().Padding(5);
                            }
                        });

                        // Footer
                        page.Footer().AlignCenter().Text($"Generated on {DateTime.Now:yyyy-MM-dd HH:mm}")
                            .FontSize(10).FontColor("#7F8C8D");
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
