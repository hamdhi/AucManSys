namespace AuctionManagementSystem.Models
{
    public class BidDto
    {
        public int BidId { get; set; }
        public string UserId { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
    }
}
