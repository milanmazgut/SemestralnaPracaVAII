﻿using System.ComponentModel.DataAnnotations;

namespace SemestralnaPraca.Server.Data
{
    public class ContactMessage
    {
        [Key]
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string? Phone { get; set; }

        public string Subject { get; set; }

        public string Message { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
