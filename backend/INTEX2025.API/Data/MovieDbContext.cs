using System;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;

public class MovieDbContext : DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }

    public DbSet<movies_rating> Ratings { get; set; }     // Ratings table
    public DbSet<movies_title> Movies { get; set; }       // Movies table
    public DbSet<movies_user> MovieUsers { get; set; }         // Users table
    public DbSet<genre_name> GenreNames { get; set; }              // Genres table
    public DbSet<movies_genre> MovieGenres { get; set; }  // linking table

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<genre_name>().ToTable("genre_names"); // 👈 This line
        modelBuilder.Entity<movies_user>()
            .Property(u => u.UserId)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<movies_genre>()
            .HasKey(mg => new { mg.show_id, mg.GenreID });
        modelBuilder.Entity<movies_rating>()
            .HasKey(mr => new { mr.show_id, mr.user_id });

        base.OnModelCreating(modelBuilder);
    }
}
