using System.ComponentModel.DataAnnotations;

namespace SemestralnaPraca.Server.Data
{
    public class Address
    {
        [Key]
        public int Id { get; set; }

        public string Street { get; set; }

        public string City { get; set; }

        public string PostalCode { get; set; }

        public string Phone { get; set; }
    }
}
