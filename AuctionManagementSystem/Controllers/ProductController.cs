using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Security.Cryptography;


namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public ProductController(DbContextOptions<ApplicationDbContext> options)
        {
            dbContext = ApplicationDbContext.GetInstance(options);
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
        [HttpPost("add")]
        public IActionResult AddProduct(AddProductDto dto)
        {
            var product = new Product
            {
                Cat_Id = dto.Cat_Id,
                Username = dto.Username,
                Product_Name = dto.Product_Name,
                Description = dto.Description,
                Min_Bid_Price = dto.Min_Bid_Price,
                Status = dto.Status,
                Photo = dto.Photo,
                Start_Date = DateTime.Now,
                End_Date = dto.End_Date
            };

            if (product == null)
                return NotFound("Product not found");


            dbContext.Products.Add(product);
            dbContext.SaveChanges();

            return Ok("Product added successfully");
        }

        // PUT: api/Product/update/{id}
        [HttpPut("update/{id}")]
        public IActionResult UpdateProduct(int id, Product updatedProduct)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.Product_Id == id);
            if (product == null)
                return NotFound("Product not found");

            product.Product_Name = updatedProduct.Product_Name;
            product.Description = updatedProduct.Description;
            product.Min_Bid_Price = updatedProduct.Min_Bid_Price;
            product.Status = updatedProduct.Status;
            product.Photo = updatedProduct.Photo;
            //product.Start_Date = updatedProduct.Start_Date;  do not add start date it should not be changed
            product.End_Date = updatedProduct.End_Date;
            product.Cat_Id = updatedProduct.Cat_Id;
            product.Username = updatedProduct.Username;
            product.Confirmed_Id = updatedProduct.Confirmed_Id;

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

            dbContext.Products.Remove(product);
            dbContext.SaveChanges();
            return Ok("Product deleted");
        }
    }
}
