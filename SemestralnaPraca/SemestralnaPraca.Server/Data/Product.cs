using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SemestralnaPraca.Server.Data
{
    public class Product
    {
        [Key]
        public int Id { get; set; }  
        public string Name { get; set; }    
        public string Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public string Category { get; set; }
        public int NumberOfParameters { get; set; }
    }
}
