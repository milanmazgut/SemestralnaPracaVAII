using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SemestralnaPraca.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace SemestralnaPraca.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(UserManager<ApplicationUser> userManager,
                                 SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [Authorize]
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Boli ste úspešne odhlásený" });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Registrácia bola úspešná" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Neplatné prihlasovacie údaje" });
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return Ok(new { message = "Prihlásenie bolo úspešné" });
            }

            return Unauthorized(new { message = "Neplatné prihlasovacie údaje" });
        }


        [Authorize]
        [HttpGet("UserProfile")]
        public async Task<IActionResult> GetUserProfile()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            return Ok(new
            {
                name = user.Name,
                email = user.Email
            });
        }


        public class RegisterModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }

            [Required]
            [Compare("Password", ErrorMessage = "Heslá sa nezhodujú.")]
            public string ConfirmPassword { get; set; }

            [Required]
            public string Name { get; set; }
        }


        public class LoginModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } 

            [Required]
            public string Password { get; set; } 

            [Required]
            public bool RememberMe { get; set; }

        }


    }
}