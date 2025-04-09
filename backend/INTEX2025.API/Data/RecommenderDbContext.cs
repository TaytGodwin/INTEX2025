using INTEX.API.Data.RecommenderModels;
using Microsoft.EntityFrameworkCore;

// Entity Framework DbContext for the recommender system database
namespace INTEX.API.Data;

public class RecommenderDbContext : DbContext
{
    public RecommenderDbContext(DbContextOptions<RecommenderDbContext> options) : base(options) {}

    // Table: content_recs1 - Content-based recommendation scores by show_id
    // public DbSet<ContentRecs1> ContentRecs1 { get; set; }

    // Table: genre_recommendations - Recommendations based on genre similarity
    public DbSet<GenreRecommendations> GenreRecommendations { get; set; }

    // Table: top10_userId - Top 10 similar users based on distance metric
    public DbSet<Top10UserId> Top10UserIds { get; set; }

    // Table: top5_showIds - Static mapping from shows to five recommendations
    public DbSet<Top5ShowIds> Top5ShowIds { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Explicitly map class names to table names and mark them as keyless
        // modelBuilder.Entity<ContentRecs1>().ToTable("content_recs1").HasNoKey();
        modelBuilder.Entity<GenreRecommendations>().ToTable("genre_recommendations").HasNoKey();
        modelBuilder.Entity<Top10UserId>().ToTable("top10_userId").HasNoKey();
        modelBuilder.Entity<Top5ShowIds>().ToTable("top5_showIds").HasNoKey();
    }
}