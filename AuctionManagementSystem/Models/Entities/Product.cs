using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace AuctionManagementSystem.Models.Entities
{
    public class Product
    {
        [Key]
        public int Product_Id { get; set; }

        // Foreign Key to Category
        public int Cat_Id { get; set; }
        public Category? Category { get; set; }

        // Username of the user who added the product
        public string Username { get; set; }

        public string Product_Name { get; set; }
        public string Description { get; set; }
        public decimal Min_Bid_Price { get; set; }
        public int Status { get; set; } // 1 = Available, 0 = Not Available
        public string Photo { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime End_Date { get; set; }

        // FK to confirmed product
        public int? Confirmed_Id { get; set; }
        public ConfirmedProduct? Confirmed { get; set; }
    }
}
