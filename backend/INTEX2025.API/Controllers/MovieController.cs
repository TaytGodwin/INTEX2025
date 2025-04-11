using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using INTEX.API.Data;
using Azure.Storage.Blobs;

namespace INTEX.API.Controllers
{
    // Define route and mark as API controller
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        // Instance of MovieDbContext for database operations on movies
        private readonly MovieDbContext _movieContext;

        // Constructor: Inject MovieDbContext
        public MovieController(MovieDbContext context)
        {
            _movieContext = context;
        }

        // GET: api/Movie/Search
        // Search movies with optional query, pagination, and genre filtering
        [HttpGet("Search")]
        [Authorize] // Accessible to logged in users
        public IActionResult SearchMovies(
                [FromQuery] string query = "",
                [FromQuery] int pageSize = 25,
                [FromQuery] int pageNum = 1,
                [FromQuery] List<string>? genrelist = null)
                {
                    // Start query including movie genres
                    var queryResult = _movieContext.Movies
                    .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                    .AsQueryable();

                    // Filter by search query if provided
                    if (!string.IsNullOrWhiteSpace(query))
                    {
                        queryResult = queryResult.Where(m => m.title.Contains(query));
                    }

                    // Filter by genre list if provided
                    if (genrelist != null && genrelist.Any())
                    {
                        // Get genre IDs matching provided genre names
                        var genreIDs = _movieContext.GenreNames
                            .Where(g => genrelist.Contains(g.GenreName))
                            .Select(g => g.GenreID)
                            .ToList();
                        
                        // Filter movies that have at least one genre matching the genre IDs
                        queryResult = queryResult.Where(m => m.MovieGenres.Any(mg => genreIDs.Contains(mg.GenreID)));
                    }

                    // Order, paginate, and select required movie data
                    var movies = queryResult
                        .OrderBy(m => m.title)
                        .Skip((pageNum - 1) * pageSize)
                        .Take(pageSize)
                        .Select(m => new
                        {
                            m.show_id,
                            title = m.title ?? "",
                            type = m.type ?? "",
                            director = m.director ?? "",
                            cast = m.cast ?? "",
                            country = m.country ?? "",
                            release_year = m.release_year,
                            rating = m.rating ?? "",
                            duration = m.duration ?? "",
                            description = m.description ?? "",
                            // Select genres associated with the movie
                            Genres = m.MovieGenres.Select(mg => mg.Genre.GenreName ?? "").ToList()
                        })
                        .ToList();

                    // Return the list of movies as JSON
                    return Ok(new { Movies = movies });
                }

        // GET: api/Movie/AllMovies
        // Returns all movies with sorting, pagination, and optional genre filtering
        [HttpGet("AllMovies")]
        [Authorize] // Accessible to logged in users
        public IActionResult AllMovies(int pageSize = 25, int pageNum = 1, string sortBy = "title", [FromQuery] List<string>? genrelist = null)
        {
            // Start query including movie genres
            var query = _movieContext.Movies
                .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                .AsQueryable();

            // Filter by genre if a list is provided
            if (genrelist != null && genrelist.Any())
            {
                var genreIDs = _movieContext.GenreNames
                    .Where(g => genrelist.Contains(g.GenreName))
                    .Select(g => g.GenreID)
                    .ToList();

                query = query.Where(m => m.MovieGenres.Any(mg => genreIDs.Contains(mg.GenreID)));
            }

            // Allow only specific fields for sorting
            var allowedSortFields = new[] { "title", "director", "type" };
            if (!allowedSortFields.Contains(sortBy))
            {
                sortBy = "title";
            }

            // Order by chosen field, paginate, and select necessary movie data
            var AllMovies = query
                .OrderBy(m => sortBy == "title" ? (m.title ?? "") : 
                         sortBy == "director" ? (m.director ?? "") : "")
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new
                {
                    m.show_id,
                    title = m.title ?? "",
                    type = m.type ?? "",
                    director = m.director ?? "",
                    cast = m.cast ?? "",
                    country = m.country ?? "",
                    release_year = m.release_year,
                    rating = m.rating ?? "",
                    duration = m.duration ?? "",
                    description = m.description ?? "",
                    // Get associated genres for the movie
                    Genres = m.MovieGenres.Select(mg => mg.Genre.GenreName ?? "").ToList()
                })
                .ToList();

            // Count total number of movies for pagination
            var totalNumMovies = query.Count();

            // Return movies along with total count
            return Ok(new {Movies = AllMovies, totalNumMovies});
        }


        // GET: api/Movie/GetGenres
        // Retrieves a distinct list of genres available
        [HttpGet("GetGenres")]
        [Authorize] // Accessible to logged in users
        public IActionResult GetGenres()
        {
            var allGenres = _movieContext.GenreNames
                        .Select(g => new
                        {
                            g.GenreID,
                            g.GenreName
                        })
                        .Distinct()
                        .ToList();

            // Return the list of genres
            return Ok(allGenres);
        }


        // POST: api/Movie/AddMovie
        // Adds a new movie record with optional genre associations
        [HttpPost("AddMovie")]
        [Authorize(Roles = "Administrator")] // Only Administrators can add movies
        public IActionResult AddMovie([FromBody] MovieUpdateDto newMovieDto)
        {
            // 1. Create a new movie instance from the provided DTO
            var newMovie = new movies_title
            {
                title = newMovieDto.title,
                type = newMovieDto.type,
                director = newMovieDto.director,
                cast = newMovieDto.cast,
                country = newMovieDto.country,
                release_year = newMovieDto.release_year,
                rating = newMovieDto.rating,
                duration = newMovieDto.duration,
                description = newMovieDto.description
            };

            // 2. Add the new movie to the database context and save changes
            _movieContext.Movies.Add(newMovie);
            _movieContext.SaveChanges();

            // 3. If genres are provided, link them to the new movie
            if (newMovieDto.Genres != null && newMovieDto.Genres.Any())
            {
                var genreIDs = _movieContext.GenreNames
                    .Where(g => newMovieDto.Genres.Contains(g.GenreName))
                    .Select(g => g.GenreID)
                    .ToList();

                foreach (var genreID in genreIDs)
                {
                    _movieContext.MovieGenres.Add(new movies_genre
                    {
                        show_id = newMovie.show_id,
                        GenreID = genreID
                    });
                }

                _movieContext.SaveChanges();
            }

            // Return success response
            return Ok();
        }


        // PUT: api/Movie/UpdateMovie
        // Updates an existing movie record and its genre associations
        [HttpPut("UpdateMovie")]
        [Authorize(Roles = "Administrator")] // Only Administrators can update movies
        public IActionResult UpdateMovie([FromBody] MovieUpdateDto updatedMovie)
        {
            // Find the existing movie along with its genres
            var existingMovie = _movieContext.Movies
                .Include(m => m.MovieGenres)
                .FirstOrDefault(m => m.show_id == updatedMovie.show_id);

            // Return 404 if the movie is not found
            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // Update movie fields
            existingMovie.title = updatedMovie.title;
            existingMovie.type = updatedMovie.type;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;
            
            // Remove old genre links
            var existingGenres = _movieContext.MovieGenres.Where(mg => mg.show_id == updatedMovie.show_id);
            _movieContext.MovieGenres.RemoveRange(existingGenres);
            
            // If new genres are provided, add the new links
            if (updatedMovie.Genres != null)
            {
                var newGenreIDs = _movieContext.GenreNames
                    .Where(g => updatedMovie.Genres.Contains(g.GenreName))
                    .Select(g => g.GenreID)
                    .ToList();

                foreach (var genreID in newGenreIDs)
                {
                    _movieContext.MovieGenres.Add(new movies_genre
                    {
                        show_id = updatedMovie.show_id,
                        GenreID = genreID
                    });
                }
            }

            // Save all changes to the database
            _movieContext.SaveChanges();

            // Return success response
            return Ok();
        }


        // DELETE: api/Movie/DeleteMovie
        // Deletes a movie and its associated ratings and genres
        [Authorize(Roles = "Administrator")] // Only Administrators can delete movies
        [HttpDelete("DeleteMovie")]
        public async Task<IActionResult> DeleteMovie([FromBody] int showIdToDelete)
        {
            // Find the movie by its show_id
            var movie = await _movieContext.Movies.FindAsync(showIdToDelete);

            // Return 404 if the movie is not found
            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // Delete associated ratings
            var ratings = _movieContext.Ratings.Where(r => r.show_id == showIdToDelete);
            _movieContext.Ratings.RemoveRange(ratings);

            // Delete associated genre links
            var genres = _movieContext.MovieGenres.Where(g => g.show_id == showIdToDelete);
            _movieContext.MovieGenres.RemoveRange(genres);

            // Delete the movie record
            _movieContext.Movies.Remove(movie);

            // Save all changes to the database
            await _movieContext.SaveChangesAsync();

            // Return success response indicating deletion
            return Ok(new { message = "Movie and associated data deleted successfully" });
        }


        // GET: api/Movie/GetRating
        // Retrieves the rating of a movie by a specific user
        [HttpGet("GetRating")]
        [Authorize]
        public async Task<IActionResult> GetRating([FromQuery] int userId, int showId)
        {
            // Find the rating record for the given user and movie
            var userRating = await _movieContext.Ratings.FirstOrDefaultAsync(r => r.user_id == userId && r.show_id == showId);

            // If no rating exists, default value is 0
            int ratingValue = userRating != null ? userRating.rating : 0;

            // Return the rating value
            return Ok(new { rating = ratingValue });
        }
        

        // POST: api/Movie/AddRating
        // Adds a new rating for a movie from a user
        [HttpPost("AddRating")]
        [Authorize]
        public async Task<IActionResult> AddRating([FromQuery] int rating, [FromQuery] int userId, [FromQuery] int showId)
        {
            // Create a new rating record from the provided values
            var newRating = new movies_rating
            {
                show_id = showId,
                user_id = userId,
                rating = rating
            };

            // Add the new rating to the database
            _movieContext.Ratings.Add(newRating);

            // Save changes asynchronously
            await _movieContext.SaveChangesAsync();

            // Return success response
            return Ok(new { message = "Rating added successfully" });
        }

        // GET: api/Movie/debug-claims
        // Returns user claims for debugging purposes
        [Authorize]
        [HttpGet("debug-claims")]
        public IActionResult DebugClaims()
        {
            // Return a list of claim types and values for the authenticated user
            return Ok(User.Claims.Select(c => new { c.Type, c.Value }));
        }

    }
}
