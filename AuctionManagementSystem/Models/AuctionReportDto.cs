namespace AuctionManagementSystem.Models
{
    public class AuctionReportDto
    {
        public int Product_Id { get; set; }
        public string Product_Name { get; set; } = "";
        public string Description { get; set; } = "";
        public decimal Min_Bid_Price { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime End_Date { get; set; }

        public List<BidDto> Bids { get; set; } = new List<BidDto>();
    }
}
