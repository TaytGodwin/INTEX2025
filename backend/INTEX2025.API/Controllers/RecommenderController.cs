using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;

namespace INTEX.API.Controllers;

[Route("api/[controller]")]
[ApiController]
// This controller provides various recommendation endpoints for shows based on different models and datasets.
// It interacts with multiple SQLite databases and Entity Framework contexts to return show recommendations.
public class RecommenderController : ControllerBase
{
    private readonly RecommenderDbContext _context;

    public RecommenderController(RecommenderDbContext context)
    {
        _context = context;
    }

    // Endpoint: /api/recommender/content_recs1?showId={showId}
    // Description: Returns top 10 recommended shows based on content similarity for a given showId
    [HttpGet("content_recs1")]
    public IActionResult GetContentRecs1([FromQuery] string showId)
    {
        // Path to the SQLite database
        var dbPath = "../backend/INTEX2025.API/recommender.db";

        // Collect all valid column names in the 'content_similarity' table
        var validColumns = new HashSet<string>();
        using (var schemaConn = new Microsoft.Data.Sqlite.SqliteConnection($"Data Source={dbPath}"))
        {
            schemaConn.Open();
            var schemaCmd = schemaConn.CreateCommand();
            schemaCmd.CommandText = "PRAGMA table_info(content_similarity);";

            using (var reader = schemaCmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    var colName = reader.GetString(1); // Column name is at index 1
                    validColumns.Add(colName);
                }
            }
        }

        // Check if the provided showId is a valid column
        if (!validColumns.Contains(showId))
        {
            return BadRequest("Invalid showId.");
        }

        var results = new List<string>();

        // Query for top 10 shows similar to the input showId
        using (var connection = new Microsoft.Data.Sqlite.SqliteConnection($"Data Source={dbPath}"))
        {
            connection.Open();
            var cmd = connection.CreateCommand();
            // Dynamically use the valid showId column in the ORDER BY clause
            cmd.CommandText = $"SELECT show_id, title, \"{showId}\" FROM content_similarity WHERE show_id != @showId ORDER BY \"{showId}\" DESC LIMIT 10";
            cmd.Parameters.AddWithValue("@showId", showId);

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    results.Add($"{reader.GetString(0)} - {reader.GetString(1)}"); // Format: show_id - title
                }
            }
        }

        return Ok(results); // Return a list of recommended show_id and title strings
    }

    // Endpoint: /api/recommender/genre_recommendations
    // Description: Randomly selects one comedy show and returns its top 10 genre-based recommendations
    [HttpGet("genre_recommendations")]
    public IActionResult GetGenreRecommendations()
    {
        // Get all comedy show IDs
        var comedyShowIds = _context.GenreRecommendations
            .Where(gr => gr.Genre.Contains("Comedies"))
            .Select(gr => gr.ShowId)
            .Distinct()
            .ToList();

        if (!comedyShowIds.Any())
            return NotFound("No comedy show_ids found.");

        // Pick one comedy show at random
        var rand = new Random();
        var selectedShowId = comedyShowIds[rand.Next(comedyShowIds.Count)];

        // Retrieve top 10 recommendations for the selected comedy show
        var recommendations = _context.GenreRecommendations
            .Where(gr => gr.ShowId == selectedShowId)
            .OrderByDescending(gr => gr.Score)
            .Take(10)
            .Select(gr => new
            {
                gr.RecommendedId,
                gr.Genre,
                gr.Score
            })
            .ToList();

        return Ok(new { selectedShowId, recommendations });
    }

    // Endpoint: /api/recommender/top10_movietitle?showId={showId}
    // Description: Returns top 10 recommended show IDs based on movie title similarity
    [HttpGet("top10_movietitle")]
    public IActionResult GetTop10MovieTitles([FromQuery] string showId)
    {
        // Query for top 10 recommended show IDs based on the provided showId
        var recommendations = _context.Top10MovieTitles
            .Where(r => r.ShowId == showId)
            .OrderByDescending(r => r.Score)
            .Take(10)
            .Select(r => new
            {
                r.RecommendedId,
                r.Score
            })
            .ToList();

        return Ok(recommendations); // Return the list of recommendations
    }

    // Endpoint: /api/recommender/top10_userId?userId={userId}
    // Description: Returns top 10 recommended shows for a user based on user similarity
    [HttpGet("top10_userId")]
    public IActionResult GetTop10UserIds([FromQuery] int userId)
    {
        // Query for top 10 recommended shows based on the userId
        var results = _context.Top10UserIds
            .Where(u => u.UserId == userId)
            .OrderByDescending(u => u.Distance)
            .Take(10)
            .Select(u => new
            {
                u.ShowId,
                u.Distance
            })
            .ToList();

        return Ok(results); // Return the list of results
    }

    // Endpoint: /api/recommender/top5_showIds?showId={showId}
    // Description: Returns top 5 hand-picked recommendations for a specific show
    [HttpGet("top5_showIds")]
    public IActionResult GetTop5ShowIds([FromQuery] string showId)
    {
        // Query for recommendations based on the provided showId
        var rec = _context.Top5ShowIds
            .Where(r => r.Index == showId)
            .Select(r => new
            {
                r.IfYouLike,
                r.Recommendation1,
                r.Recommendation2,
                r.Recommendation3,
                r.Recommendation4,
                r.Recommendation5
            })
            .FirstOrDefault();

        if (rec == null)
            return NotFound("No recommendations found for that showId.");

        return Ok(rec); // Return the recommendations
    }

    // Endpoint: /api/recommender/topmovies
    // Description: Returns top 10 movies overall based on predicted ratings
    [HttpGet("topmovies")]
    public async Task<IActionResult> GetTopMovies()
    {
        // Retrieve top 10 movies ordered by predicted ratings
        var data = await _context.TopMovies
            .OrderByDescending(m => m.PredictedRating)
            .Take(10)
            .ToListAsync();

        return Ok(data); // Return the list of top movies
    }
}