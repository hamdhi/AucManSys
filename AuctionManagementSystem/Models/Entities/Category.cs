using System.ComponentModel.DataAnnotations;

namespace AuctionManagementSystem.Models.Entities
{
    public class Category
    {
        [Key]
        public int Cat_Id { get; set; }
        public string Cat_Name { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
