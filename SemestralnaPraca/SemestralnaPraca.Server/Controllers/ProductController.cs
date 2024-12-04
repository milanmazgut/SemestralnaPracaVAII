using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SemestralnaPraca.Server.Data;

namespace SemestralnaPraca.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;

        public ProductController(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;

        }

        [HttpGet("get")]
        public async Task<ActionResult<Product>> GetProduct([FromQuery] int id)
        {
            var product = await _dbContext.ProductsDb.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }
            return Ok(product);
        }
        
        [HttpGet("getAll")] 
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _dbContext.ProductsDb.ToListAsync();
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddProduct([FromBody] Product newProduct)
        {
            if (newProduct == null)
            {
                return BadRequest("Invalid product data");
            }
            try
            {
                _dbContext.ProductsDb.Add(newProduct);
                await _dbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);


            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }


        }
    }
}
