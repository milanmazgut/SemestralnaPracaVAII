using Microsoft.AspNetCore.Mvc;
using SemestralnaPraca.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace SemestralnaPraca.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactMessageController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;

        public ContactMessageController(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateMessage([FromBody] ContactMessage model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _dbContext.ContactMessages.Add(model);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Správa bola úspešne uložená." });
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllMessages()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Používateľ nie je prihlásený.");
            }

            var currentUser = await _dbContext.UsersDB.FindAsync(userId);
            if (currentUser == null)
            {
                return Unauthorized("Používateľ neexistuje.");
            }

            if (currentUser.Role != "Admin")
            {
                return Forbid();
            }

            var messages = await _dbContext.ContactMessages
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }

    }
}
