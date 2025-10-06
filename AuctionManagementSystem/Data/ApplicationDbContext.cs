
using AuctionManagementSystem.Models.Entities;
using Microsoft.EntityFrameworkCore;

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
        }
    }
}

