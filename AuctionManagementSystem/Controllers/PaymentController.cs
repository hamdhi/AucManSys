using AuctionManagementSystem.Data;
using AuctionManagementSystem.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AuctionManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAll()
        {
            return await _context.Payments.ToListAsync();
        }

        // GET: api/payments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetById(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();
            return payment;
        }

        // POST: api/payments
        [HttpPost]
        public async Task<ActionResult<Payment>> Create(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment);
        }

        // PUT: api/payments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Payment updatedPayment)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            payment.UserId = updatedPayment.UserId;
            payment.Amount = updatedPayment.Amount;
            payment.Method = updatedPayment.Method;
            payment.Date = updatedPayment.Date;
            payment.Status = updatedPayment.Status;

            await _context.SaveChangesAsync();
            return Ok(payment);
        }

        // DELETE: api/payments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
