using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;
using System.ComponentModel.DataAnnotations.Schema;
using INTEX.API.Data.RecommenderModels;

namespace INTEX.API.Controllers;

[Route("api/[controller]")]
[ApiController]
// This controller provides various recommendation endpoints for shows based on different models and datasets.
// It interacts with multiple SQLite databases and Entity Framework contexts to return show recommendations.
public class RecommenderController : ControllerBase
{
    private readonly RecommenderDbContext _context;
    private readonly MovieDbContext _movieDb;

    public RecommenderController(RecommenderDbContext context, MovieDbContext movieDb)
    {
        _context = context;
        _movieDb = movieDb;
    }

    // This function will return movie details when given a list of showIds
    private async Task<List<MovieUpdateDto>> GetMovieDetailsByShowIds(List<string> showIds)
    {
        var movieDtos = await _movieDb.Movies
            .Where(m => showIds.Contains(m.show_id))
            .Select(m => new MovieUpdateDto
            {
                title = m.title,
                type = m.type,
                director = m.director,
                cast = m.cast,
                country = m.country,
                release_year = m.release_year,
                rating = m.rating,
                duration = m.duration,
                description = m.description,
                Genres = _movieDb.MovieGenres
                    .Where(mg => mg.show_id == m.show_id)
                    .Join(_movieDb.GenreNames,
                          mg => mg.GenreID,
                          gn => gn.GenreID,
                          (mg, gn) => gn.GenreName)
                    .ToList()
            })
            .ToListAsync();

        return movieDtos;
    }


    // Endpoint: /api/recommender/content_recs1?showId={showId}
    // Description: Returns top 10 recommended shows based on content similarity for a given showId
    [HttpGet("content_recs1")]
    public async Task<IActionResult> GetContentRecs1([FromQuery] string showId)
    {
        var propertyName = showId?.Trim();
        if (string.IsNullOrEmpty(propertyName))
            return BadRequest("showId cannot be null or empty.");

        // Get all property names from ContentRecs1 model
        var validColumns = typeof(ContentRecs1).GetProperties()
            .Select(p => p.GetCustomAttributes(typeof(ColumnAttribute), false)
                          .Cast<ColumnAttribute>()
                          .FirstOrDefault()?.Name ?? p.Name.ToLower())
            .ToHashSet();

        Console.WriteLine("Valid columns: " + string.Join(", ", validColumns));
        Console.WriteLine("Requested showId: " + propertyName);

        if (!validColumns.Contains(propertyName.ToLower()))
        {
            return BadRequest($"Invalid showId: '{propertyName}'");
        }

        var prop = typeof(ContentRecs1).GetProperties()
            .FirstOrDefault(p =>
                (p.GetCustomAttributes(typeof(ColumnAttribute), false)
                   .Cast<ColumnAttribute>()
                   .FirstOrDefault()?.Name ?? p.Name.ToLower()) == propertyName.ToLower());

        if (prop == null)
            return BadRequest($"Property for showId '{propertyName}' not found.");

        var topResults = _context.ContentRecs1
            .AsEnumerable() // switch to in-memory for dynamic property access
            .Where(r => r.ShowId != propertyName)
            .Select(r => new
            {
                r.ShowId,
                Score = prop.GetValue(r) as float? ?? 0f
            })
            .OrderByDescending(r => r.Score)
            .Take(10)
            .ToList();

        // ✅ Extract just the ShowIds
        var showIds = topResults.Select(r => r.ShowId).ToList();

        var movieDetails = await GetMovieDetailsByShowIds(showIds);

        return Ok(movieDetails);
    }

    // Endpoint: /api/recommender/genre_recommendations
    // Description: Randomly selects one comedy show and returns its top 10 genre-based recommendations
    [HttpGet("genre_recommendations")]
    public async Task<IActionResult> GetGenreRecommendations()
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
            .Select(gr => gr.RecommendedId)
            .ToList();

        var movieDetails = await GetMovieDetailsByShowIds(recommendations);

        return Ok(movieDetails);
    }

    // Endpoint: /api/recommender/top10_movietitle?showId={showId}
    // Description: Returns top 10 recommended show IDs based on movie title similarity
    [HttpGet("top10_movietitle")]
    public async Task<IActionResult> GetTop10MovieTitles([FromQuery] string showId)
    {
        // Query for top 10 recommended show IDs based on the provided showId
        var recommendations = _context.Top10MovieTitles
            .Where(r => r.ShowId == showId)
            .OrderByDescending(r => r.Score)
            .Take(10)
            .Select(r => r.RecommendedId)
            .ToList();

        var movieDetails = await GetMovieDetailsByShowIds(recommendations);

        return Ok(movieDetails); // Return the list of recommended movies
    }

    // Endpoint: /api/recommender/top10_userId?userId={userId}
    // Description: Returns top 10 recommended shows for a user based on user similarity
    [HttpGet("top10_userId")]
    public async Task<IActionResult> GetTop10UserIds([FromQuery] int userId)
    {
        // Query for top 10 recommended shows based on the userId
        var results = _context.Top10UserIds
            .Where(u => u.UserId == userId)
            .OrderByDescending(u => u.Distance)
            .Take(10)
            .Select(u => u.ShowId)
            .ToList();

        var movieDetails = await GetMovieDetailsByShowIds(results);

        return Ok(movieDetails); // Return the list of recommended movies
    }

    // Endpoint: /api/recommender/top5_showIds?showId={showId}
    // Description: Returns top 5 hand-picked recommendations for a specific show
    [HttpGet("top5_showIds")]
    public async Task<IActionResult> GetTop5ShowIds([FromQuery] string showId)
    {
        // Step 1: Query the hand-picked recommendations based on the provided showId
        var rec = _context.Top5ShowIds
            .Where(r => r.Index == showId)
            .Select(r => new
            {
                r.IfYouLike,        // The original show being referenced
                r.Recommendation1,  // Recommended show 1
                r.Recommendation2,  // Recommended show 2
                r.Recommendation3,  // Recommended show 3
                r.Recommendation4,  // Recommended show 4
                r.Recommendation5   // Recommended show 5
            })
            .FirstOrDefault();

        // Step 2: If no matching recommendation is found, return 404 Not Found
        if (rec == null)
            return NotFound("No recommendations found for that showId.");

        // Step 3: Gather the recommended showIds into a list
        var showIds = new List<string>
    {
        rec.IfYouLike,
        rec.Recommendation1,
        rec.Recommendation2,
        rec.Recommendation3,
        rec.Recommendation4,
        rec.Recommendation5
    };

        // Step 4: Retrieve detailed movie info for each recommended showId
        var movieDetails = await GetMovieDetailsByShowIds(showIds);

        // Step 5: Return the movie details in the response with the first one being the one they like
        return Ok(movieDetails);
    }


    // Endpoint: /api/recommender/topmovies
    // Description: Returns top 10 movies overall based on predicted ratings
    [HttpGet("topmovies")]
    public async Task<IActionResult> GetTopMovies()
    {
        // Step 1: Retrieve top 10 movie predictions ordered by highest predicted rating
        var topPredicted = await _context.TopMovies
            .OrderByDescending(m => m.PredictedRating)
            .Take(10)
            .ToListAsync();

        // Step 2: Extract the show IDs from the top predictions
        var showIds = topPredicted.Select(m => m.ShowId).ToList();

        // Step 3: Use those show IDs to fetch full movie details (title, cast, genre, etc.)
        var movieDetails = await GetMovieDetailsByShowIds(showIds);

        // Step 4: Return the movie detail objects as the response
        return Ok(movieDetails);
    }

}