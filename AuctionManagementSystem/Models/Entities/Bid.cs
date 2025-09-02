using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionManagementSystem.Models.Entities
{
    public class Bid
    {
        [Key]
        public int BidId { get; set; }

        // Foreign key to Product
        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [Required]
        public Guid UserId {  get; set; }

        [ForeignKey("UserId")]
        public UserAuth UserAuth { get; set; }

        [Required]
        public decimal BidAmount { get; set; }

        public DateTime BidTime { get; set; } = DateTime.Now;
    }
}
