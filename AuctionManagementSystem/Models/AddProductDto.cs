namespace AuctionManagementSystem.Models
{
    public class AddProductDto
    {
        public int Cat_Id { get; set; }        // category
        public string Username { get; set; }   // user who adds
        public string Product_Name { get; set; }
        public string Description { get; set; }
        public decimal Min_Bid_Price { get; set; }
        public int Status { get; set; }        // 1=Available, 0=Not available
        public string Photo { get; set; }
        public DateTime End_Date { get; set; } // user sets end date
    }
}
