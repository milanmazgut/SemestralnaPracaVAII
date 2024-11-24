using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SemestralnaPraca.Server.Data
{
    public class ApplicationDBContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<ApplicationUser> UsersDB { get; set; }

        public ApplicationDBContext (DbContextOptions<ApplicationDBContext> options) :base(options)
        {
        
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
