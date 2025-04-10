using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using INTEX.API.Data;
using Azure.Storage.Blobs;

namespace INTEX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        // Instance of context file
        private readonly MovieDbContext _movieContext;

        public MovieController(MovieDbContext context)
        {
            _movieContext = context;
        }

        // This is a Search Route
        [HttpGet("Search")]
        [Authorize] // Used by all logged in
        public IActionResult SearchMovies(
                [FromQuery] string query = "",
                [FromQuery] int pageSize = 25,
                [FromQuery] int pageNum = 1,
                [FromQuery] List<string>? genrelist = null)
                
                {
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
                    var genreIDs = _movieContext.GenreNames
                        .Where(g => genrelist.Contains(g.GenreName))
                        .Select(g => g.GenreID)
                        .ToList();
                    queryResult = queryResult.Where(m => m.MovieGenres.Any(mg => genreIDs.Contains(mg.GenreID)));
                }

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
                        Genres = m.MovieGenres.Select(mg => mg.Genre.GenreName ?? "").ToList()
                    })
                    .ToList();

                return Ok(new { Movies = movies });
            }

        [HttpGet("AllMovies")]
        [Authorize] // Used by all logged in
        public IActionResult AllMovies(int pageSize = 25, int pageNum = 1, string sortBy = "title", [FromQuery] List<string>? genrelist = null)
        {
            var query = _movieContext.Movies
                .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                .AsQueryable();

            if (genrelist != null && genrelist.Any())
            {
                var genreIDs = _movieContext.GenreNames
                    .Where(g => genrelist.Contains(g.GenreName))
                    .Select(g => g.GenreID)
                    .ToList();

                query = query.Where(m => m.MovieGenres.Any(mg => genreIDs.Contains(mg.GenreID)));
            }

            var allowedSortFields = new[] { "title", "director", "type" };
            if (!allowedSortFields.Contains(sortBy))
            {
                sortBy = "title";
            }

            var AllMovies = query
                .OrderBy(m => sortBy == "title" ? (m.title ?? "") : // Handles nulls
                         sortBy == "director" ? (m.director ?? "") : "") // For strings
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
                    Genres = m.MovieGenres.Select(mg => mg.Genre.GenreName ?? "").ToList()
                })
                .ToList();

            var totalNumMovies = query.Count();

            return Ok(new {Movies = AllMovies, totalNumMovies});
        }


        // ✅ Get distinct genre names
        [HttpGet("GetGenres")]
        [Authorize] // Used by all logged in
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

            return Ok(allGenres);
        }


        // ✅ Add a movie
        [HttpPost("AddMovie")]
        [Authorize("Administrator")] // Requires administrator role
        public IActionResult AddMovie([FromBody] MovieUpdateDto newMovieDto)
        {
            // 1. Create a new movie instance from the DTO
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

            // 2. Add the movie to the context first
            _movieContext.Movies.Add(newMovie);
            _movieContext.SaveChanges();

            // 3. Link genres (if provided)
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

            return Ok();
        }



        // ✅ Update a movie
        [HttpPut("UpdateMovie")]
        [Authorize("Administrator")] // Requires administrator role
        public IActionResult UpdateMovie([FromBody] MovieUpdateDto updatedMovie)
        {
            var existingMovie = _movieContext.Movies
                .Include(m => m.MovieGenres)
                .FirstOrDefault(m => m.show_id == updatedMovie.show_id);

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // ✅ Update movie fields
            existingMovie.title = updatedMovie.title;
            existingMovie.type = updatedMovie.type;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;
            
            // Remove old links
            var existingGenres = _movieContext.MovieGenres.Where(mg => mg.show_id == updatedMovie.show_id);
            _movieContext.MovieGenres.RemoveRange(existingGenres);
            
            // ✅ Update genres
            if (updatedMovie.Genres != null)
            {
                // Add new ones
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

            _movieContext.SaveChanges();

            return Ok();
        }


        // ✅ Delete a movie
        [Authorize("Administrator")] // Requires administrator role
        [HttpDelete("DeleteMovie")]
        public async Task<IActionResult> DeleteMovie([FromBody] int showIdToDelete)
        {
            // Find the movie by its show_id
            var movie = await _movieContext.Movies.FindAsync(showIdToDelete);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // Delete associated ratings in the movies_ratings table
            var ratings = _movieContext.Ratings.Where(r => r.show_id == showIdToDelete);
            _movieContext.Ratings.RemoveRange(ratings);

            // Delete associated genres in the movies_genres table
            var genres = _movieContext.MovieGenres.Where(g => g.show_id == showIdToDelete);
            _movieContext.MovieGenres.RemoveRange(genres);

            // Delete the movie itself from the movies_titles table
            _movieContext.Movies.Remove(movie);

            // Save all changes to the database in one transaction
            await _movieContext.SaveChangesAsync();

            return Ok(new { message = "Movie and associated data deleted successfully" });
        }



    }
}
