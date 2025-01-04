using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly ApplicationDBContext _dbContext;

        public AuthController(UserManager<ApplicationUser> userManager,
                                 SignInManager<ApplicationUser> signInManager,
                                    ApplicationDBContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
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

            // Overenie existencie emailu
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Používateľ s týmto emailom už existuje" });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                Role = "User"
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Registrácia bola úspešná" });
            }

            // Ak heslo nesplnilo politiku identity vrati chybu
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

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                return Ok(new { message = "Prihlásenie bolo úspešné" });
            }

            return Unauthorized(new { message = "Neplatné prihlasovacie údaje" });
        }

        [HttpGet("UserProfile")]
        public async Task<IActionResult> GetUserProfile()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Používateľská identita nie je k dispozícii." });
            }

            var user = await _userManager.Users
                .Include(u => u.Adress)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "Používateľ neexistuje." });
            }


            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role,
                address = user.Adress != null ? new
                {
                    street = user.Adress.Street,
                    city = user.Adress.City,
                    postalCode = user.Adress.PostalCode,
                    phone = user.Adress.Phone
                } : null
            }) ;
        }

        [Authorize]
        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUser = await _userManager.FindByIdAsync(userId);

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Neplatný používateľ." });
            }

            if (currentUser.Role != "Admin")
            {
                return Forbid();
            }

            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpPut("EditUser")]
        public async Task<IActionResult> EditUser([FromBody] EditModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUser = await _userManager.FindByIdAsync(currentUserId);

            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid();
            }

            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
                return NotFound(new { message = "Používateľ neexistuje" });

            // Overenie emailu
            if (!string.Equals(user.Email, model.Email, StringComparison.OrdinalIgnoreCase))
            {
                var userWithSameEmail = await _userManager.FindByEmailAsync(model.Email);
                if (userWithSameEmail != null && userWithSameEmail.Id != user.Id)
                {
                    return Conflict(new { message = "Používateľ s týmto emailom už existuje" });
                }
            }


            if (model.Role != "Admin" && model.Role != "User")
            {
                return BadRequest(new { message = "Rola môže byť iba 'Admin' alebo 'User'." });
            }

            user.Name = model.Name;
            user.Email = model.Email;
            user.Role = model.Role;
            user.UserName = model.Email;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "Používateľ bol úspešne aktualizovaný" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        //uprava vlastneho profilu
        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized(new {message = "Pou6ívatel nieje prihlásený"});
            }

            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
                return NotFound(new { message = "Používateľ neexistuje." });

            
            if (currentUserId != model.Id)
            {
                return Forbid();
            }

            // Overenie duplicity emailu
            if (!string.Equals(user.Email, model.Email, StringComparison.OrdinalIgnoreCase))
            {
                var userWithSameEmail = await _userManager.FindByEmailAsync(model.Email);
                if (userWithSameEmail != null && userWithSameEmail.Id != user.Id)
                {
                    return Conflict(new { message = "Používateľ s týmto emailom už existuje." });
                }
            }

            user.Name = model.Name;
            user.Email = model.Email;
            user.UserName = model.Email;

            if (user.AddressId == null)
            {
                var newAddress = new Address
                {
                    Street = model.Street,
                    City = model.City,
                    PostalCode = model.PostalCode,
                    Phone = model.Phone
                };

                _dbContext.AddressDB.Add(newAddress);
                await _dbContext.SaveChangesAsync();

                user.AddressId = newAddress.Id;
            }
            else
            {
                var existingAddress = await _dbContext.AddressDB.FindAsync(user.AddressId);
                if (existingAddress == null)
                {
                    return NotFound(new { message = "Pôvodná adresa sa nenašla." });
                }
                existingAddress.Street = model.Street;
                existingAddress.City = model.City;
                existingAddress.PostalCode = model.PostalCode;
                existingAddress.Phone = model.Phone;

                _dbContext.AddressDB.Update(existingAddress);
                await _dbContext.SaveChangesAsync();
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }

            return Ok(new { message = "Profil bol úspešne aktualizovaný." });
        }


        [Authorize]
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUser = await _userManager.FindByIdAsync(currentUserId);

            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Používateľ neexistuje" });
            }

            //Hlavny admin
            if (user.Role == "Admin" && user.Email == "mino@test.sk")
            {
                return BadRequest(new { message = "Tohto administrátora nie je možné zmazať." });
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "Používateľ bol úspešne zmazaný" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        public class RegisterModel
        {
            [Required(ErrorMessage = "Email je povinný.")]
            [EmailAddress(ErrorMessage = "Neplatný formát emailu.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Heslo je povinné.")]
            [MinLength(6, ErrorMessage = "Heslo musí mať aspoň 6 znakov.")]
            public string Password { get; set; }

            [Required(ErrorMessage = "Je potrebné potvrdiť heslo.")]
            [Compare("Password", ErrorMessage = "Heslá sa nezhodujú.")]
            public string ConfirmPassword { get; set; }

            [Required(ErrorMessage = "Meno je povinné.")]
            public string Name { get; set; }
        }

        public class LoginModel
        {
            [Required(ErrorMessage = "Email je povinný.")]
            [EmailAddress(ErrorMessage = "Neplatný formát emailu.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Heslo je povinné.")]
            public string Password { get; set; }

            [Required(ErrorMessage = "Pole 'Zapamätať si ma' je povinné.")]
            public bool RememberMe { get; set; }

        }

        public class EditModel
        {
            [Required(ErrorMessage = "Id je povinné.")]
            public string Id { get; set; }

            [Required(ErrorMessage = "Meno je povinné.")]
            public string Name { get; set; }

            [Required(ErrorMessage = "Email je povinný.")]
            [EmailAddress(ErrorMessage = "Neplatný formát emailu.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Rola je povinná.")]
            [RegularExpression("Admin|User", ErrorMessage = "Rola môže byť 'Admin' alebo 'User'.")]
            public string Role { get; set; }
        }

        public class UserProfileModel
        {
            [Required]
            public string Id { get; set; }

            [Required]
            public string Name { get; set; }

            [EmailAddress]
            [Required]
            public string Email { get; set; }

            [Required]
            public string Street { get; set; }

            [Required]
            public string City { get; set; }

            [Required]
            public string PostalCode { get; set; }

            [Required]
            [Phone(ErrorMessage = "Neplatný formát telefónneho čísla.")]

            public string Phone { get; set; }
        }

    }
}
