using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace INTEX.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet for your custom User model
        public DbSet<User> Users { get; set; }
        public DbSet<movies_user> Movies_Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);  // Important to call this if you're inheriting from IdentityDbContext

            // Define many-to-many relationship between Users and Movies through movies_user
            modelBuilder.Entity<movies_user>()
                .HasKey(mu => new { mu.MovieId, mu.UserId });

            modelBuilder.Entity<movies_user>()
                .HasOne(mu => mu.Movie)
                .WithMany(m => m.MovieLinks)
                .HasForeignKey(mu => mu.MovieId);

            modelBuilder.Entity<movies_user>()
                .HasOne(mu => mu.User)
                .WithMany(u => u.MovieLinks)
                .HasForeignKey(mu => mu.UserId);

            // You can add other custom configurations here as needed
        }
    }
}
