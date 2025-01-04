using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SemestralnaPraca.Server.Data
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public int? AddressId { get; set; }
        public Address? Address { get; set; }

        public int StateId { get; set; }
        [ForeignKey(nameof(StateId))]
        public OrderState State { get; set; }
        public ICollection<OrderItem> OrderItem { get; set; }
    }
}