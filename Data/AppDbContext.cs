
using Microsoft.EntityFrameworkCore;
using SchedulerWebApi.Models;

namespace SchedulerWebApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Appointment> Appointments => Set<Appointment>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Appointment>().HasIndex(a => new { a.BranchId, a.Start });
        }
    }
}
