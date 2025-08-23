namespace AuctionManagementSystem.Models
{
    public class AddUserAuthDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        // Role: Admin, Seller, Bidder
        public string Role { get; set; }
        public bool IsActive { get; set; }
    }
}
