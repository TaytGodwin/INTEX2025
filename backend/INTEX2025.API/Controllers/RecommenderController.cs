using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;
using INTEX.API.Data.RecommenderModels;
using Microsoft.AspNetCore.Authorization;

namespace INTEX.API.Controllers;

// This controller provides endpoints to get different types of movie recommendations
// using various recommendation models and data sources.
[Route("api/[controller]")]
[ApiController]
public class RecommenderController : ControllerBase
{
    // Database contexts:
    // _context: used for recommendation models
    // _movieDb: used for retrieving movie details
    private readonly RecommenderDbContext _context;
    private readonly MovieDbContext _movieDb;

    // Constructor initializes the two database contexts.
    public RecommenderController(RecommenderDbContext context, MovieDbContext movieDb)
    {
        _context = context;
        _movieDb = movieDb;
    }

    // Given a list of showIds, this method fetches full movie details including genres.
    // It returns human-readable movie information instead of just IDs.
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
    // 1. Get all shows that match the given genre.
    // 2. Select 2 random show IDs from the matched results.
    // 3. Find up to 10 recommended shows (ordered by score) for these selected shows.
    // 4. Return detailed movie information for these recommendations.
    [HttpGet("genre_recommendations")]
    [Authorize] // Accessible to all logged-in users
    public async Task<IActionResult> GetGenreRecommendations([FromQuery] string genreName)
    {
        if (string.IsNullOrWhiteSpace(genreName))
            return BadRequest("Genre name is required.");

        // Normalize the input genre for consistent matching.
        string normalizedGenre = genreName.Trim().ToLower();

        // Pull all genre rows from DB
        var allGenreRows = _context.GenreRecommendations.ToList();

        // Filter in-memory where the genre column (split by commas) contains the provided genre.
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

        // Select 2 random show IDs.
        var rand = new Random();
        var selectedShowIds = genreShowIds.OrderBy(x => rand.Next()).Take(2).ToList();

        // Find recommendations for those show IDs: up to 10 recommended IDs ordered by score.
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

    // Endpoint: /api/recommender/content_recs1?userId={userId}
    // This method returns shows that are similar to the ones a user rated above 3.
    // For each positively rated movie, it queries the content_recs1 table via raw SQL to get recommendations.
    [HttpGet("content_recs1")]
    [Authorize] // Accessible to all logged-in users
    public async Task<IActionResult> GetUserRecommendedLists([FromQuery] int userId)
    {
        // Retrieve movies that the user rated above 3 from the movies rating table.
        var ratings = await _movieDb.Ratings
            .Where(r => r.user_id == userId && r.rating > 3)
            .ToListAsync();

        if (!ratings.Any())
            return NotFound($"No ratings above 3 found for userId {userId}.");

        var resultList = new List<object>();

        foreach (var rating in ratings)
        {
            long baseShowId = rating.show_id;
            // Build and execute the query on the content_recs1 table for each movie's recommendations.
            string query = $@"
            SELECT show_id, [{baseShowId}] as score
            FROM content_recs1
            WHERE show_id != {baseShowId}
            ORDER BY score DESC
            LIMIT 10;
        ";

            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            var command = connection.CreateCommand();
            command.CommandText = query;

            var recommendedShowIds = new List<long>();
            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    if (!reader.IsDBNull(0))
                        recommendedShowIds.Add(reader.GetInt64(0));
                }
            }

            var movieDetails = await GetMovieDetailsByShowIds(recommendedShowIds);
            resultList.Add(new { BaseShowId = baseShowId, Recommendations = movieDetails });
        }

        return Ok(resultList);
    }

    // Endpoint: /api/recommender/top10_userId?userId={userId}
    // This method finds the top 10 shows recommended to a user based on user similarity.
    // It uses a 'distance' metric to rank similar users and then returns their associated show recommendations.
    [HttpGet("top10_userId")]
    [Authorize] // Accessible to all logged-in users
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
    // It assumes that a curated table (top5_showids) exists with these recommendations.
    [HttpGet("top5_showIds")]
    [Authorize] // Accessible to all logged-in users
    public async Task<IActionResult> GetTop5ShowIdsFixed([FromQuery] long showId)
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = $@"
            SELECT 
                [Recommendation 1], 
                [Recommendation 2], 
                [Recommendation 3], 
                [Recommendation 4], 
                [Recommendation 5]
            FROM top5_showids
            WHERE show_id = {showId};
        ";

        var showIds = new List<long>();

        using (var reader = await command.ExecuteReaderAsync())
        {
            if (!reader.HasRows)
                return NotFound("No recommendations found for that showId.");

            while (await reader.ReadAsync())
            {
                for (int i = 0; i < 5; i++)
                {
                    if (!reader.IsDBNull(i))
                    {
                        // Recommendation 5 is stored as FLOAT, so convert accordingly.
                        var value = reader.GetValue(i);
                        if (value is double dbl)
                            showIds.Add(Convert.ToInt64(dbl));
                        else if (value is long lng)
                            showIds.Add(lng);
                    }
                }
            }
        }

        var movieDetails = await GetMovieDetailsByShowIds(showIds);
        return Ok(movieDetails);
    }
}