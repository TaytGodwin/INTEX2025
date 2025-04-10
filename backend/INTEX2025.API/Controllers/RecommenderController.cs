using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;
using System.ComponentModel.DataAnnotations.Schema;
using INTEX.API.Data.RecommenderModels;
using Microsoft.AspNetCore.Authorization;

namespace INTEX.API.Controllers;



// This controller provides endpoints to get different types of movie recommendations
// using different recommendation models and data sources.
[Route("api/[controller]")]
[ApiController]
public class RecommenderController : ControllerBase
{

    //contexts
    private readonly RecommenderDbContext _context;
    private readonly MovieDbContext _movieDb;

    // Constructor initializes the two database contexts:
    // - _context: used for recommendation models
    // - _movieDb: used for retrieving movie details
    public RecommenderController(RecommenderDbContext context, MovieDbContext movieDb)
    {
        _context = context;
        _movieDb = movieDb;
    }

    // Given a list of showIds, this method fetches full movie details including genres.
    // It's used to return human-readable movie info instead of just IDs.
    // This function will return movie details when given a list of showIds
    private async Task<List<MovieUpdateDto>> GetMovieDetailsByShowIds(List<long> showIds)
    {
        var movieDtos = await _movieDb.Movies
            .Where(m => showIds.Contains(m.show_id))
            .Select(m => new MovieUpdateDto
            {
                show_id = m.show_id,
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

    // Endpoint: /api/recommender/genre_recommendations
    // 1. Get all shows that match the given genre
    // 2. Randomly pick 2 shows from this genre
    // 3. Find top 5 recommended shows based on score for these picked shows
    // 4. Return detailed movie information for these recommendations
    // [HttpGet("genre_recommendations")]
    // public async Task<IActionResult> GetGenreRecommendations([FromQuery] string genreName)
    // {
    //     var genreShowIds = _context.GenreRecommendations
    //         .Where(gr => gr.Genre.Contains(genreName))
    //         .Select(gr => gr.ShowId)
    //         .Distinct()
    //         .ToList();

    //     if (!genreShowIds.Any())
    //         return NotFound($"No show_ids found for genre '{genreName}'.");

    //     var rand = new Random();
    //     var selectedShowIds = genreShowIds.OrderBy(x => rand.Next()).Take(2).ToList();

    //     var recommendations = _context.GenreRecommendations
    //         .Where(gr => selectedShowIds.Contains(gr.ShowId))
    //         .OrderByDescending(gr => gr.Score)
    //         .Take(5)
    //         .Select(gr => gr.RecommendedId)
    //         .Distinct()
    //         .ToList();

    //     var movieDetails = await GetMovieDetailsByShowIds(recommendations);

    //     return Ok(movieDetails);
    // }
    [HttpGet("genre_recommendations")]
    [Authorize] // Used by all logged in
    public async Task<IActionResult> GetGenreRecommendations([FromQuery] string genreName)
        {
            if (string.IsNullOrWhiteSpace(genreName))
                return BadRequest("Genre name is required.");

            // Normalize the input
            string normalizedGenre = genreName.Trim().ToLower();

            // Pull all genre rows from DB
            var allGenreRows = _context.GenreRecommendations.ToList();

            // Filter in-memory where genre column (split by commas) contains the provided genre
            var genreShowIds = allGenreRows
                .Where(gr => gr.Genre
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(g => g.Trim().ToLower())
                    .Contains(normalizedGenre))
                .Select(gr => gr.ShowId)
                .Distinct()
                .ToList();

            if (!genreShowIds.Any())
                return NotFound($"No show_ids found for genre '{genreName}'.");

            // Select 2 random show IDs
            var rand = new Random();
            var selectedShowIds = genreShowIds.OrderBy(x => rand.Next()).Take(2).ToList();

            // Find recommendations for those show IDs
            var recommendations = allGenreRows
                .Where(gr => selectedShowIds.Contains(gr.ShowId))
                .OrderByDescending(gr => gr.Score)
                .Select(gr => gr.RecommendedId)
                .Distinct()
                .Take(10)
                .ToList();

            if (!recommendations.Any())
                return NotFound("No recommendations found for the selected genre.");

            var movieDetails = await GetMovieDetailsByShowIds(recommendations);
            return Ok(movieDetails);
        }

    // Endpoint: /api/recommender/content_recs1?showId={showId}
    // This method returns shows that are most similar to the given showId based on content similarity.
    // It uses raw SQL to directly query the wide content_recs1 table for performance reasons.
    // Steps:
    // 1. Select the score column for the given showId
    // 2. Exclude the original show itself
    // 3. Sort by similarity score
    // 4. Return the top 10 most similar showIds and their details
    [HttpGet("content_recs1")]
    [Authorize] // Used by all logged in
    public async Task<IActionResult> GetContentRecs1([FromQuery] long showId)
    {
        var query = $@"
            SELECT show_id, [{showId}] as score
            FROM content_recs1
            WHERE show_id != {showId}
            ORDER BY score DESC
            LIMIT 10;
        ";

        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();
        var command = connection.CreateCommand();
        command.CommandText = query;

        var showIds = new List<long>();
        using (var reader = await command.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                if (!reader.IsDBNull(0))
                    showIds.Add(reader.GetInt64(0));
            }
        }

        var movieDetails = await GetMovieDetailsByShowIds(showIds);

        return Ok(movieDetails);
    }

    // Endpoint: /api/recommender/top10_userId?userId={userId}
    // This method finds the top 10 shows recommended to a user based on user similarity.
    // It uses the 'distance' metric to rank which other users are similar.
    [HttpGet("top10_userId")]
    [Authorize] // Used by all logged in
    public async Task<IActionResult> GetTop10UserIds([FromQuery] int userId)
    {
        var results = _context.Top10UserIds
            .Where(u => u.UserId == userId)
            .OrderByDescending(u => u.Distance)
            .Take(10)
            .Select(u => u.ShowId)
            .ToList();

        var movieDetails = await GetMovieDetailsByShowIds(results);

        return Ok(movieDetails);
    }

    // Endpoint: /api/recommender/top5_showIds?showId={showId}
    // This method returns 5 hand-picked recommendations for a show.
    // It assumes a curated table exists where these are manually defined.
    // Steps:
    // 1. Get the recommendation row by showId
    // 2. Parse the recommended showIds
    // 3. Fetch their movie details and return
    [HttpGet("top5_showIds")]
    [Authorize] // Used by all logged in
    public async Task<IActionResult> GetTop5ShowIds([FromQuery] long showId)
    {
        var rec = _context.Top5ShowIds
            .Where(r => r.ShowId == showId)
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

        var showIds = new List<long>
        {
            showId,
            long.Parse(rec.Recommendation1),
            long.Parse(rec.Recommendation2),
            long.Parse(rec.Recommendation3),
            long.Parse(rec.Recommendation4),
            long.Parse(rec.Recommendation5)
        };

        var movieDetails = await GetMovieDetailsByShowIds(showIds);

        return Ok(movieDetails);
    }
}