using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SemestralnaPraca.Server.Data;
using System.Security.Claims;

namespace SemestralnaPraca.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrdersController(
            ApplicationDBContext dbContext,
            UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
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

            var orders = await _dbContext.OrdersDb
                .Include(o => o.State)
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .OrderByDescending(o => o.Date)
                .ToListAsync();

            var result = orders.Select(o => new
            {
                o.Id,
                o.Date,
                stateId = o.StateId,
                stateName = o.State.Name,
                userEmail = o.User.Email,

                Items = o.OrderItem.Select(oi => new
                {
                    oi.Product.Name,
                    oi.Quantity,
                    oi.Price,
                    oi.Parameter,
                    Total = oi.Quantity * oi.Price
                }),
                Total = o.OrderItem.Sum(oi => oi.Quantity * oi.Price)
            });

            return Ok(result);
        }


        [HttpPost("add")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrder model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // 1. Pozrieť sa, či uzivatel už existuje
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = model.Email,
                        Email = model.Email,
                        Name = model.FullName,
                        Adress = $"{model.Address}, {model.City} {model.Zip}"
                    };

                    var createResult = await _userManager.CreateAsync(user, "superTajneHeslo123");
                    if (!createResult.Succeeded)
                    {
                        return BadRequest(new { message = "Nepodarilo sa vytvoriť používateľa." });
                    }

                }
                else
                {
                    user.Adress = $"{model.Address}, {model.City} {model.Zip}";
                    var updateResult = await _userManager.UpdateAsync(user);

                }


                // 2. Vytvoríme objednávku
                var objednavka = new Order
                {
                    UserId = user.Id,
                    Date = DateTime.Now,
                    StateId = 1
                };
                _dbContext.OrdersDb.Add(objednavka);
                await _dbContext.SaveChangesAsync();

                // 3. Vytvoríme položky objednávky
                foreach (var item in model.Items)
                {


                    var produkt = await _dbContext.ProductsDb
                        .FirstOrDefaultAsync();

                    if (produkt == null)
                    {
                        return BadRequest(new { message = "Produkt neexistuje." });

                    }

                    var orderItem = new OrderItem
                    {
                        OrderId = objednavka.Id,
                        ProductId = produkt.Id,
                        Quantity = item.Quantity,
                        Price = item.Price,
                        Parameter = (item.Dimensions != null && item.Dimensions.Any())
                            ? string.Join(" × ", item.Dimensions)
                            : "-"
                    };
                    _dbContext.ItemsDb.Add(orderItem);
                }

                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Objednávka bola úspešne vytvorená.",
                    orderId = objednavka.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("userOrders")]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                // Zisti aktuálneho prihláseného používateľa
                var userEmail = User.FindFirstValue(ClaimTypes.Email);
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { message = "Používateľ nie je prihlásený." });
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    return NotFound(new { message = "Používateľ neexistuje." });
                }

                var orders = await _dbContext.OrdersDb
                    .Include(o => o.OrderItem)
                        .ThenInclude(oi => oi.Product)
                    .Include(o => o.State)
                    .Where(o => o.UserId == user.Id)
                    .OrderByDescending(o => o.Date)
                    .ToListAsync();

                var result = orders.Select(o => new
                {
                    o.Id,
                    o.Date,
                    stateId = o.Id,
                    State = o.State.Name,
                    Items = o.OrderItem.Select(oi => new
                    {
                        oi.Product.Name,
                        oi.Quantity,
                        oi.Price,
                        oi.Parameter,
                        Total = oi.Quantity * oi.Price
                    }),
                    Total = o.OrderItem.Sum(oi => oi.Quantity * oi.Price)
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{orderId}/state")]
        public async Task<IActionResult> UpdateOrderState(int orderId, [FromBody] UpdateOrderState model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "Používateľ nie je prihlásený." });
            }

            var currentUser = await _userManager.FindByIdAsync(userId);
            if (currentUser == null)
            {
                return Unauthorized(new { message = "Neplatný používateľ." });
            }

            if (currentUser.Role != "Admin")
            {
                return Forbid();
            }

            var order = await _dbContext.OrdersDb
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound(new { message = "Objednávka neexistuje." });
            }

            var newState = await _dbContext.OrderStates
                .FirstOrDefaultAsync(s => s.Id == model.NewStateId);

            if (newState == null)
            {
                return BadRequest(new { message = "Zadaný stav objednávky neexistuje." });
            }

            order.StateId = newState.Id;

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Stav objednávky bol zmenený." });
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetOrderStates()
        {
            var states = await _dbContext.OrderStates
                .Select(s => new { s.Id, s.Name })
                .ToListAsync();

            return Ok(states);
        }
    }

    public class CartItem
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string[]? Dimensions { get; set; }
        public string? DimensionsKey { get; set; }
    }

    public class CreateOrder
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }

        public List<CartItem> Items { get; set; }
    }

    public class UpdateOrderState
    {
        public int NewStateId {  get; set; } 
    }
}