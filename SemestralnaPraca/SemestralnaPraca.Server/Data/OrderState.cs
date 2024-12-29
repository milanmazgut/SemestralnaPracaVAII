using System.ComponentModel.DataAnnotations;

namespace SemestralnaPraca.Server.Data
{
    public class OrderState
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}