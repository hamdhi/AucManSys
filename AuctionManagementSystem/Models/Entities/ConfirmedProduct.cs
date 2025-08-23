using System.ComponentModel.DataAnnotations;

namespace AuctionManagementSystem.Models.Entities
{
    public class ConfirmedProduct
    {
        [Key]
        public int Confirmed_Id { get; set; }

        // FK to Product
        public int Product_Id { get; set; }
        public Product Product { get; set; }

        public DateTime Confirmed_Date { get; set; }
        public string ConfirmedBy { get; set; } // admin username
    }
}
