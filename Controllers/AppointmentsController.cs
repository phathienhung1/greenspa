
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchedulerWebApi.Data;
using SchedulerWebApi.Models;
using System.Text;

namespace SchedulerWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AppointmentsController(AppDbContext db) { _db = db; }

        // GET: /api/appointments?branchId=1&day=2025-10-16
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> Get([FromQuery] int branchId, [FromQuery] DateTime day)
        {
            var from = day.Date;
            var to = from.AddDays(1);
            var list = await _db.Appointments
                .Where(a => a.BranchId == branchId && a.Start >= from && a.Start < to)
                .OrderBy(a => a.Start)
                .ToListAsync();
            return Ok(list);
        }

        // POST: /api/appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> Create([FromBody] AppointmentCreateDto dto)
        {
            if (dto.Start >= dto.End) return BadRequest("Invalid time range.");
            var ap = new Appointment
            {
                Start = dto.Start,
                End = dto.End,
                BranchId = dto.BranchId,
                CustomerName = dto.CustomerName?.Trim(),
                Phone = dto.Phone?.Trim(),
                Services = dto.Services?.Trim(),
                InvoiceCode = dto.InvoiceCode?.Trim(),
                Paid = dto.Paid
            };
            _db.Appointments.Add(ap);
            await _db.SaveChangesAsync();
            return Ok(ap);
        }
        private bool TryGetBranchId(HttpContext ctx, out int branchId)
        {
            branchId = 0;
            var auth = ctx.Request.Headers["Authorization"].FirstOrDefault();
            if (auth == null || !auth.StartsWith("Bearer ")) return false;

            var raw = Encoding.UTF8.GetString(Convert.FromBase64String(auth.Substring(7)));
            var parts = raw.Split('.');
            if (parts.Length < 3) return false;
            branchId = int.Parse(parts[1]);
            var exp = DateTime.Parse(parts[2]);
            return DateTime.UtcNow < exp.ToUniversalTime();
        }

    }
}
