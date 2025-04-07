using System;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;

public class MovieDbContext : DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
    }

    public DbSet<movies_ratings> Ratings { get; set; } // For movie ratings table
    public DbSet<movies_titles> Movies { get; set; } // Title tables
    public DbSet<movies_users> Users { get; set; } // Users table
}
