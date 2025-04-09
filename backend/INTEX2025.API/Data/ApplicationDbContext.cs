using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace INTEX.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public object Movies_User;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet for your custom User model

        public DbSet<movies_user> Movies_Users { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // keep this
            modelBuilder.Entity<movies_user>().ToTable("movies_users");
        }
    }
}
