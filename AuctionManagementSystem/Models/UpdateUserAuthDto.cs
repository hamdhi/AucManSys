namespace AuctionManagementSystem.Models
{
    public class UpdateUserAuthDto
    {
        public string Username { get; set; } // new
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public string? PasswordHash { get; set; } // optional
    }
}
