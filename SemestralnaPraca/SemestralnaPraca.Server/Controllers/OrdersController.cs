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
                .Include(o => o.Address)
                .OrderByDescending(o => o.Date)
                .ToListAsync();

            var result = orders.Select(o => new
            {
                o.Id,
                o.Date,
                stateId = o.StateId,
                stateName = o.State.Name,
                userEmail = o.User.Email,

                address = new
                {
                    o.Address.Street,
                    o.Address.City,
                    o.Address.PostalCode,
                    o.Address.Phone
                },

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
                        Role = "User"
                    };

                    var createResult = await _userManager.CreateAsync(user, "superTajneHeslo123");
                    if (!createResult.Succeeded)
                    {
                        return BadRequest(new { message = "Nepodarilo sa vytvoriť používateľa.", errors = createResult.Errors });
                    }

                    var userAddress = new Address
                    {
                        Street = model.Address,
                        City = model.City,
                        PostalCode = model.Zip,
                        Phone = model.Phone
                    };

                    _dbContext.AddressDB.Add(userAddress);
                    await _dbContext.SaveChangesAsync();

                    user.AddressId = userAddress.Id;
                    var updateResult = await _userManager.UpdateAsync(user);
                    if (!updateResult.Succeeded)
                    {
                        return BadRequest(new { message = "Nepodarilo sa aktualizovať adresu používateľa."});
                    }
                }
                else
                {
                    if (user.AddressId == null)
                    {
                        var newAddress = new Address
                        {
                            Street = model.Address,
                            City = model.City,
                            PostalCode = model.Zip,
                            Phone = model.Phone
                        };

                        _dbContext.AddressDB.Add(newAddress);
                        await _dbContext.SaveChangesAsync();

                        user.AddressId = newAddress.Id;
                    }
                    else
                    {
                        var existingAddress = await _dbContext.AddressDB.FindAsync(user.AddressId);
                        if (existingAddress != null)
                        {
                            existingAddress.Street = model.Address;
                            existingAddress.City = model.City;
                            existingAddress.PostalCode = model.Zip;
                            existingAddress.Phone = model.Phone;

                            _dbContext.AddressDB.Update(existingAddress);
                            await _dbContext.SaveChangesAsync();
                        }
                    }
                }

                var orderAddress = new Address
                {
                    Street = model.Address,
                    City = model.City,
                    PostalCode = model.Zip,
                    Phone = model.Phone
                };
                _dbContext.AddressDB.Add(orderAddress);
                await _dbContext.SaveChangesAsync();

                var objednavka = new Order
                {
                    UserId = user.Id,
                    Date = DateTime.Now,
                    StateId = 1,
                    AddressId = orderAddress.Id
                };
                _dbContext.OrdersDb.Add(objednavka);
                await _dbContext.SaveChangesAsync();

                foreach (var item in model.Items)
                {
                    var produkt = await _dbContext.ProductsDb
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                    if (produkt == null)
                    {
                        return BadRequest(new { message = $"Produkt s ID {item.ProductId} neexistuje." });
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
                    .Include(o => o.Address)
                    .Where(o => o.UserId == user.Id)
                    .OrderByDescending(o => o.Date)
                    .ToListAsync();

                var result = orders.Select(o => new
                {
                    o.Id,
                    o.Date,
                    stateId = o.Id,
                    State = o.State.Name,

                    address = o.Address != null ? new
                    {
                        o.Address.Street,
                        o.Address.City,
                        o.Address.PostalCode,
                        o.Address.Phone
                    } : null,

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

        [HttpPut("state/{orderId}")]
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


        [HttpPut("cancel/{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            // Zistíme ID prihláseného používateľa
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "Používateľ nie je prihlásený." });
            }

            // Načítame používateľa z databázy
            var currentUser = await _userManager.FindByIdAsync(userId);
            if (currentUser == null)
            {
                return Unauthorized(new { message = "Neplatný používateľ." });
            }


            var order = await _dbContext.OrdersDb
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound(new { message = "Objednávka neexistuje." });
            }

            if (order.UserId != userId && currentUser.Role != "Admin")
            {
                return Forbid();
            }

            if (order.StateId != 1)
            {
                return BadRequest(new {message = "Objednavku už nemožno zrušiť"});
            }
            order.StateId = 5;
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Objednávka bola úspešne zrušená." });
        }

        [HttpDelete("delete/{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
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
                .Include(o => o.OrderItem) 
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound(new { message = "Objednávka neexistuje." });
            }
            
            _dbContext.OrdersDb.Remove(order);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Objednávka bola úspešne vymazaná." });
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
        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Neplatný formát emailu.")]
        public string Email { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Zip { get; set; }

        [Required]
        [Phone(ErrorMessage = "Neplatný formát telefónneho čísla.")]
        public string Phone { get; set; }

        public List<CartItem> Items { get; set; }
    }


    public class UpdateOrderState
    {
        public int NewStateId {  get; set; } 
    }
}