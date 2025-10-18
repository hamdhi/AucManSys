using System.ComponentModel.DataAnnotations;

namespace AuctionManagementSystem.Models.Entities
{
    public class UserAuth
    {
        public Guid UserId { get; set; }   // Primary Key
        public string Username { get; set; }
        public string Email { get; set; }

        [MaxLength(60)]
        public string PasswordHash { get; set; }

        // Role: Admin, Seller, Bidder
        public string Role { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
    }
}
