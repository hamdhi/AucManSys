using System;

namespace AuctionManagementSystem.Models.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } // e.g., Card, PayPal
        public DateTime Date { get; set; }
        public string Status { get; set; } // e.g., Pending, Completed
    }
}

