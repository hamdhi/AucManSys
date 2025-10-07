using AuctionManagementSystem.Models.Entities;

namespace AuctionManagementSystem.Builders
{
    public class ProductBuilder
    {
        private readonly Product _product;

        public ProductBuilder()
        {
            _product = new Product();
        }

        public ProductBuilder WithProductId(int productId)
        {
            _product.Product_Id = productId;
            return this;
        }

        public ProductBuilder WithCategoryId(int catId)
        {
            _product.Cat_Id = catId;
            return this;
        }

        public ProductBuilder WithCategory(Category category)
        {
            _product.Category = category;
            return this;
        }

        public ProductBuilder WithUsername(string username)
        {
            _product.Username = username;
            return this;
        }

        public ProductBuilder WithProductName(string productName)
        {
            _product.Product_Name = productName;
            return this;
        }

        public ProductBuilder WithDescription(string description)
        {
            _product.Description = description;
            return this;
        }

        public ProductBuilder WithMinBidPrice(decimal minBidPrice)
        {
            _product.Min_Bid_Price = minBidPrice;
            return this;
        }

        public ProductBuilder WithStatus(int status)
        {
            _product.Status = status;
            return this;
        }

        public ProductBuilder WithAvailableStatus()
        {
            _product.Status = 1;
            return this;
        }

        public ProductBuilder WithUnavailableStatus()
        {
            _product.Status = 0;
            return this;
        }

        public ProductBuilder WithPhoto(string photo)
        {
            _product.Photo = photo;
            return this;
        }

        public ProductBuilder WithStartDate(DateTime startDate)
        {
            _product.Start_Date = startDate;
            return this;
        }

        public ProductBuilder WithEndDate(DateTime endDate)
        {
            _product.End_Date = endDate;
            return this;
        }

        public ProductBuilder WithDateRange(DateTime startDate, DateTime endDate)
        {
            _product.Start_Date = startDate;
            _product.End_Date = endDate;
            return this;
        }

        public ProductBuilder WithConfirmedId(int? confirmedId)
        {
            _product.Confirmed_Id = confirmedId;
            return this;
        }

        public ProductBuilder WithConfirmed(ConfirmedProduct confirmed)
        {
            _product.Confirmed = confirmed;
            return this;
        }

        public Product Build()
        {
            return _product;
        }
    }
}