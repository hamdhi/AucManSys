using AuctionManagementSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuctionManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailsController : ControllerBase
    {

        public readonly IEmailService emailService;
        public EmailsController(IEmailService emailService)
        {
            this.emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(string receptor, string subject, string body) { 
      
            await emailService.SendEmail(receptor, subject, body);
            return Ok();
        }
    }
}
