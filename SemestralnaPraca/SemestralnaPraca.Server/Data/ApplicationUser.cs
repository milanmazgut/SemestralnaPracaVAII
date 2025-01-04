using Microsoft.AspNetCore.Identity;

namespace SemestralnaPraca.Server.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }

        public string Role {  get; set; }

        public string? Adress { get; set; }

        public ICollection<Order> Orders { get; set; }

    }
}
