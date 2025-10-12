
using AuctionManagementSystem.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;

namespace AuctionManagementSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        private static ApplicationDbContext? _instance;

        // Singleton pattern
        public static ApplicationDbContext GetInstance(DbContextOptions<ApplicationDbContext> options)
        {
            if (_instance == null)
            {
                _instance = new ApplicationDbContext(options);
            }
            return _instance;
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected ApplicationDbContext() { }

        // DbSets
        public DbSet<UserAuth> userAuths { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ConfirmedProduct> ConfirmedProducts { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ---------------- UserAuth ----------------
            modelBuilder.Entity<UserAuth>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<UserAuth>().HasData(
        new UserAuth
        {
            UserId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = "admin",
            Role = "Admin",
            CreatedAt = new DateTime(2023, 10, 10),
            IsActive = true
        });

            // ---------------- Category ----------------
            modelBuilder.Entity<Category>().HasData(
                new Category { Cat_Id = 1, Cat_Name = "Electronics" },
                new Category { Cat_Id = 2, Cat_Name = "Fashion" },
                new Category { Cat_Id = 3, Cat_Name = "Home and Furniture" }
            );

            // ---------------- Product ----------------
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.Cat_Id);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Confirmed)
                .WithOne(c => c.Product)
                .HasForeignKey<ConfirmedProduct>(c => c.Product_Id);

            // ---------------- Default Products ----------------
            DateTime staticEndDate = new DateTime(2025, 12, 10);
            string defaultPhotoPath = "/images/default.png"; // Path to the default image in wwwroot/images folder
                                                             // ---------------- Product ----------------
            modelBuilder.Entity<Product>().HasData(
                // Electronics Products
                new Product { Product_Id = 1, Cat_Id = 1, Product_Name = "Smartphone", Description = "Latest model smartphone", Min_Bid_Price = 300.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },
                new Product { Product_Id = 2, Cat_Id = 1, Product_Name = "Laptop", Description = "High performance laptop", Min_Bid_Price = 800.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },
               
                // Fashion Products
                new Product { Product_Id = 6, Cat_Id = 2, Product_Name = "T-shirt", Description = "Comfortable cotton T-shirt", Min_Bid_Price = 20.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },
                new Product { Product_Id = 7, Cat_Id = 2, Product_Name = "Jeans", Description = "Stylish blue jeans", Min_Bid_Price = 40.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },
               

                // Home and Furniture Products
                new Product { Product_Id = 11, Cat_Id = 3, Product_Name = "Sofa", Description = "Comfortable 3-seater sofa", Min_Bid_Price = 300.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },
                new Product { Product_Id = 12, Cat_Id = 3, Product_Name = "Dining Table", Description = "Wooden dining table", Min_Bid_Price = 250.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },

                // DC Character Toys (Category 1: Electronics - Subcategory)
                new Product { Product_Id = 16, Cat_Id = 1, Product_Name = "Batman Action Figure", Description = "Action figure of Batman", Min_Bid_Price = 25.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" },
                new Product { Product_Id = 17, Cat_Id = 1, Product_Name = "Superman Action Figure", Description = "Action figure of Superman", Min_Bid_Price = 25.00m, Status = 1, End_Date = staticEndDate, Photo = defaultPhotoPath, Username = "admin" }
            );

            // ---------------- Payment ----------------
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Method).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Date).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            });

            // ---------------- Bid ----------------
            modelBuilder.Entity<Bid>(entity =>
            {
                entity.HasKey(e => e.BidId);
                entity.Property(e => e.BidAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.BidTime).HasDefaultValueSql("GETDATE()");
            });

            // ---------------- Product Min_Bid_Price ----------------
            modelBuilder.Entity<Product>()
                .Property(p => p.Min_Bid_Price)
                .HasColumnType("decimal(18,2)"); // Explicit precision and scale for Min_Bid_Price
        }
    }
}

