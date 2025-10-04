using Microsoft.AspNetCore.Http;
using System;

namespace AuctionManagementSystem.Models
{
    public class AddProductDto
    {
        public int Cat_Id { get; set; }
        public string Username { get; set; }
        public string Product_Name { get; set; }
        public string Description { get; set; }
        public decimal Min_Bid_Price { get; set; }
        public int Status { get; set; }

        // CHANGED: Make it nullable
        public IFormFile? Photo { get; set; }

        // CHANGED: Make it nullable string, parse in controller
        public string End_Date { get; set; }
    }
}