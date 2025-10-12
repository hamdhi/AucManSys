using AuctionManagementSystem.Builders;
using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Hosting; // ADDED: For IWebHostEnvironment
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.IO; // ADDED: For file operations
using System.Linq;
using System.Security.Cryptography;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IWebHostEnvironment _env;

        // The constructor now asks for ApplicationDbContext directly
        public ProductController(ApplicationDbContext _dbContext, IWebHostEnvironment env)
        {
            dbContext = _dbContext; // The instance is provided by dependency injection
            _env = env;
        }

        // GET: api/Product/getAll
        [HttpGet("getAll")]
        public IActionResult GetAllProducts()
        {
            var products = dbContext.Products
                .Select(p => new
                {
                    p.Product_Id,
                    CategoryName = p.Category.Cat_Name, // include name
                    p.Product_Name,
                    p.Description,
                    p.Min_Bid_Price,
                    p.Status,
                    p.Photo,
                    p.Start_Date,
                    p.End_Date,
                    p.Cat_Id,
                    p.Username,
                    p.Confirmed_Id
                }).ToList();

            return Ok(products);
        }

        // GET: api/Product/getById/{id}
        [HttpGet("getById/{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.Product_Id == id);
            if (product == null)
                return NotFound("Product not found");

            return Ok(product);
        }

        // POST: api/Product/add
        // CHANGED: Better error handling and date parsing
        [HttpPost("add")]
        public IActionResult AddProduct([FromForm] AddProductDto dto)
        {
            try
            {
                string photoFileName = null;

                // ADDED: Handle file upload
                if (dto.Photo != null && dto.Photo.Length > 0)
                {
                    try
                    {
                        // Generate unique filename
                        var fileExtension = Path.GetExtension(dto.Photo.FileName);
                        photoFileName = $"{Guid.NewGuid()}{fileExtension}";

                        // Create uploads directory if it doesn't exist
                        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        // Save file
                        var filePath = Path.Combine(uploadsFolder, photoFileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            dto.Photo.CopyTo(stream);
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest($"File upload failed: {ex.Message}");
                    }
                }

                // CHANGED: Parse the date string
                DateTime endDate;
                if (!DateTime.TryParse(dto.End_Date, out endDate))
                {
                    return BadRequest("Invalid end date format");
                }
                var product = new ProductBuilder()
                    .WithCategoryId(dto.Cat_Id)
                    .WithUsername(dto.Username)
                    .WithProductName(dto.Product_Name)
                    .WithDescription(dto.Description)
                    .WithMinBidPrice(dto.Min_Bid_Price)
                    .WithStatus(dto.Status)
                    .WithPhoto(photoFileName)
                    .WithStartDate(DateTime.Now)
                    .WithEndDate(endDate)
                    .Build();

                dbContext.Products.Add(product);
                dbContext.SaveChanges();

                return Ok("Product added successfully");
            }
            catch (Exception ex)
            {
                // ADDED: Better error reporting
                return StatusCode(500, $"An error occurred: {ex.ToString()}");
            }
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateProduct(int id, [FromForm] UpdateProductDto dto)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.Product_Id == id);
            if (product == null)
                return NotFound("Product not found");

            product.Product_Name = dto.Product_Name;
            product.Description = dto.Description;
            product.Min_Bid_Price = dto.Min_Bid_Price;
            product.Status = dto.Status;

            // Handle new photo upload
            if (dto.NewPhoto != null && dto.NewPhoto.Length > 0)
            {
                if (!string.IsNullOrEmpty(product.Photo))
                {
                    var oldPhotoPath = Path.Combine(_env.WebRootPath, "uploads", product.Photo);
                    if (System.IO.File.Exists(oldPhotoPath))
                        System.IO.File.Delete(oldPhotoPath);
                }

                var fileExtension = Path.GetExtension(dto.NewPhoto.FileName);
                var photoFileName = $"{Guid.NewGuid()}{fileExtension}";
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var filePath = Path.Combine(uploadsFolder, photoFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    dto.NewPhoto.CopyTo(stream);
                }

                product.Photo = photoFileName;
            }
            else if (!string.IsNullOrEmpty(dto.Photo))
            {
                product.Photo = dto.Photo;
            }

            product.End_Date = DateTime.Parse(dto.End_Date);
            product.Cat_Id = dto.Cat_Id;
            product.Username = dto.Username;
            if (dto.Confirmed_Id.HasValue)
                product.Confirmed_Id = dto.Confirmed_Id.Value;

            dbContext.SaveChanges();

            return Ok("Product updated");
        }

        // DELETE: api/Product/delete/{id}
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.Product_Id == id);
            if (product == null)
                return NotFound("Product not found");

            // ADDED: Delete associated photo file
            if (!string.IsNullOrEmpty(product.Photo))
            {
                try
                {
                    var photoPath = Path.Combine(_env.WebRootPath, "uploads", product.Photo);
                    if (System.IO.File.Exists(photoPath))
                    {
                        System.IO.File.Delete(photoPath);
                    }
                }
                catch (Exception ex)
                {
                    // Log error but continue with deletion
                    Console.WriteLine($"Error deleting photo: {ex.Message}");
                }
            }

            dbContext.Products.Remove(product);
            dbContext.SaveChanges();

            return Ok("Product deleted");
        }
    }
}