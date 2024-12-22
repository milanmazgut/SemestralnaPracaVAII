using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace SemestralnaPraca.Server.Data
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProductController(ApplicationDBContext dbContext,
                                 UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        
        // Získa jeden produkt podľa zadaného ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct([FromRoute] int id)
        {
            var product = await _dbContext.ProductsDb.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Produkt s ID {id} neexistuje.");
            }
            return Ok(product);
        }

        /// Vráti všetky produkty.
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var products = await _dbContext.ProductsDb.ToListAsync();
            return Ok(products);
        }
        
        // Pridá nový produkt (iba Admin).
        [HttpPost("add")]
        public async Task<ActionResult> AddProduct([FromBody] Product newProduct)
        {
            // Zisti, či je používateľ prihlásený
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized(new { message = "Používateľ nie je prihlásený." });
            }

            // Načítaj používateľa a over, či je Admin
            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid();
            }

            if (newProduct == null)
            {
                return BadRequest(new { message = "Neplatné dáta o produkte." });
            }

            try
            {
                _dbContext.ProductsDb.Add(newProduct);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduct),
                    new { id = newProduct.Id },
                    new { message = "Produkt bol úspešne pridaný.", produkt = newProduct });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Nastala chyba pri ukladaní produktu.",
                    detail = ex.Message
                });
            }
        }

        // Upraví existujúci produkt (iba Admin).
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditProduct([FromRoute] int id,
                                                     [FromBody] Product updatedProduct)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized(new { message = "Používateľ nie je prihlásený." });
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid();
            }

            if (updatedProduct == null || updatedProduct.Id != id)
            {
                return BadRequest(new { message = "Neplatné dáta o produkte." });
            }

            var product = await _dbContext.ProductsDb.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Produkt s ID {id} neexistuje." });
            }
            
            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.ImageUrl = updatedProduct.ImageUrl;
            product.Category = updatedProduct.Category;

            try
            {
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Produkt bol úspešne upravený.", produkt = product });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Nastala chyba pri ukladaní produktu.",
                    detail = ex.Message
                });
            }
        }

        // Vymaže existujúci produkt (iba Admin).
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized(new { message = "Používateľ nie je prihlásený." });
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid();
            }

            var product = await _dbContext.ProductsDb.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Produkt s ID {id} neexistuje." });
            }

            try
            {
                _dbContext.ProductsDb.Remove(product);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Produkt bol úspešne vymazaný." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Nastala chyba pri mazaní produktu.",
                    detail = ex.Message
                });
            }
        }
    }
}
