using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SemestralnaPraca.Server.Data
{
    public class ApplicationDBContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<ApplicationUser> UsersDB { get; set; }
        public DbSet<Product> ProductsDb { get; set; }
        public DbSet<Order> OrdersDb { get; set; }
        public DbSet<OrderItem> ItemsDb { get; set; }
        public DbSet<OrderState> OrderStates {  get; set; }
        public DbSet<Address> AddressDB { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }


        public ApplicationDBContext (DbContextOptions<ApplicationDBContext> options) :base(options)
        {
        
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
