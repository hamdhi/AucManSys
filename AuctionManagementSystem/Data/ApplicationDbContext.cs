using AuctionManagementSystem.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionManagementSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        protected ApplicationDbContext()
        {
        }

        public DbSet<UserAuth> userAuths { get; set; }
        public DbSet<Category> Categories { get; set; }   // <-- Add this
        public DbSet<Product> Products { get; set; }
        public DbSet<ConfirmedProduct> ConfirmedProducts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // UserAuth configuration
            modelBuilder.Entity<UserAuth>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.Username)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Email)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.PasswordHash)
                      .IsRequired();

                entity.Property(e => e.Role)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("GETDATE()");

            });   // <-- this closing bracket was missing

            // Seed 3 categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Cat_Id = 1, Cat_Name = "Electronics" },
                new Category { Cat_Id = 2, Cat_Name = "Fashion" },
                new Category { Cat_Id = 3, Cat_Name = "Home and Furniture" }
            );

            // Product → Category relationship
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)   // navigation in Product
                .WithMany(c => c.Products) // navigation in Category
                .HasForeignKey(p => p.Cat_Id); // FK column in Product

            // Product → ConfirmedProduct relationship (optional)
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Confirmed)
                .WithOne(c => c.Product)
                .HasForeignKey<ConfirmedProduct>(c => c.Product_Id);

        }
    }
}
