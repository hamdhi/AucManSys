using System.Net;
using System.Net.Mail;

namespace AuctionManagementSystem.Services
{
    public interface IEmailService
    {
        Task SendEmail(string receptor, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;

        public EmailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task SendEmail(string receptor, string subject, string body)
        {
            var email = configuration.GetValue<string>("Email_Config:Email");
            var password = configuration.GetValue<string>("Email_Config:PASSWORD");
            var host = configuration.GetValue<string>("Email_Config:HOST");
            var port = configuration.GetValue<int>("Email_Config:PORT");

            using var smtpClient = new SmtpClient(host, port);
            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(email, password);
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.Timeout = 20000;

         

            var message = new MailMessage(email!, receptor, subject, body);
            await smtpClient.SendMailAsync(message);

        }
    }
}
