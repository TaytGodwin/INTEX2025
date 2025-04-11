using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace INTEX.API.Data
{
    // ApplicationDbContext extends IdentityDbContext to integrate ASP.NET Core Identity with Entity Framework Core.
    // This context is used for managing both authentication data and application-specific user details.
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        // Custom DbSet for the movies_user entity representing additional user profile data used in the application.
        public DbSet<movies_user> Movies_Users { get; set; }

        // Constructor accepts DbContextOptions to configure the context. Options are passed to the base IdentityDbContext.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Override OnModelCreating to configure the model mappings for custom entities.
        // It's important to call the base implementation so that Identity-related mappings are set up correctly.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Ensures all Identity configurations are applied
            
            // Map the movies_user entity to the 'movies_users' table in the database.
            modelBuilder.Entity<movies_user>().ToTable("movies_users");
        }
    }
}
