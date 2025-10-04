public class UpdateProductDto
{
    public int Cat_Id { get; set; }
    public string Username { get; set; }
    public string Product_Name { get; set; }
    public string Description { get; set; }
    public decimal Min_Bid_Price { get; set; }
    public int Status { get; set; }
    public string Photo { get; set; }
    public string End_Date { get; set; }
    public IFormFile NewPhoto { get; set; }
    public int? Confirmed_Id { get; set; }
}
