
using System.ComponentModel.DataAnnotations;

namespace SchedulerWebApi.Models
{
    public class Appointment
    {
        [Key] public int Id { get; set; }
        [Required] public DateTime Start { get; set; }
        [Required] public DateTime End { get; set; }
        [Required] public int BranchId { get; set; }

        [MaxLength(100)] public string? CustomerName { get; set; }
        [MaxLength(30)] public string? Phone { get; set; }
        [MaxLength(200)] public string? Services { get; set; }
        [MaxLength(30)] public string? InvoiceCode { get; set; }
        public bool Paid { get; set; }
    }

    public class AppointmentCreateDto
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int BranchId { get; set; }
        public string? CustomerName { get; set; }
        public string? Phone { get; set; }
        public string? Services { get; set; }
        public string? InvoiceCode { get; set; }
        public bool Paid { get; set; }
    }
}
