using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using INTEX.API.Data;

namespace INTEX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        // Instance of context file
        private MovieDbContext _movieContext;
        public MovieController(MovieDbContext temp) => _movieContext = temp; // Set instance

        [HttpGet("Test")]
        public IActionResult Test()
        {
            return Ok("I am working");
        }

        [HttpGet("AllMovies")] // Get all Movies for admin user to see, but technically any authorized user could do this
        [Authorize] // Requires users to be logged in
        public IActionResult GetMovies(int pageSize = 25, int pageNum = 1, string sortBy = "title", [FromQuery] List<string>? genrelist = null) // parameters
        {
            var query = _movieContext.Movies
                .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre) // Links the genre table to this query
                .AsQueryable();

            if (genrelist != null && genrelist.Any())
            {
                // Step 1: Get matching GenreIDs
                // Get matching GenreIDs based on updated entity name: genre_name
                var genreIDs = _movieContext.GenreNames
                    .Where(g => genrelist.Contains(g.GenreName))
                    .Select(g => g.GenreID)
                    .ToList();

                // Filter movies
                query = query.Where(m => m.MovieGenres.Any(mg => genreIDs.Contains(mg.GenreID)));
            }

            var AllMovies = query // Narrowed down, filtered list
                .OrderBy(sortBy) // Uses using System.Linq.Dynamic.Core; to sort by the preference that the user gave
                .Skip((pageNum - 1) * pageSize) // Skips the page size amount until it gets to the page you are on
                .Take(pageSize) // Sends how many the user selected
                .Select(m => new // What columns will be selected
                {
                    m.show_id,
                    m.title,
                    m.type,
                    m.director,
                    m.cast,
                    m.countery,
                    m.release_year,
                    m.rating,
                    m.duration,
                    m.description,
                    Genres = m.MovieGenres.Select(mg => mg.Genre.GenreName).ToList()
                })
                .ToList();

            var totalNumMovies = query.Count();

            var TotalObject = new
            {
                Movies = AllMovies,
                totalNumMovies

            };

            return Ok(TotalObject);
        }


        // ✅ Get distinct genre names
        [HttpGet("GetGenres")]
        [Authorize]
        public IActionResult GetGenres()
        {
            var allGenres = _movieContext.GenreNames
                .Select(g => g.GenreName)
                .Distinct()
                .ToList();

            return Ok(allGenres);
        }


        // ✅ Add a movie
        [HttpPost("AddMovie")]
        [Authorize] // Requires users to be logged in
        public IActionResult AddMovie([FromBody] MovieUpdateDto newMovieDto)
        {
            // 1. Create a new movie instance from the DTO
            var newMovie = new movies_title
            {
                show_id = Guid.NewGuid().ToString(), // Or however you generate a unique ID
                title = newMovieDto.title,
                type = newMovieDto.type,
                director = newMovieDto.director,
                cast = newMovieDto.cast,
                countery = newMovieDto.countery,
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
                    _movieContext.MovieGenres.Add(new movie_genre
                    {
                        show_id = newMovie.show_id,
                        GenreID = genreID
                    });
                }

                _movieContext.SaveChanges();
            }

            return Ok(newMovie);
        }



        // ✅ Update a movie
        [HttpPut("UpdateMovie/{show_id}")]
        [Authorize] // Requires users to be logged in
        public IActionResult UpdateMovie(string show_id, [FromBody] MovieUpdateDto updatedMovie)
        {
            var existingMovie = _movieContext.Movies
                .Include(m => m.MovieGenres)
                .FirstOrDefault(m => m.show_id == show_id);

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // ✅ Update movie fields
            existingMovie.title = updatedMovie.title;
            existingMovie.type = updatedMovie.type;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.countery = updatedMovie.countery;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;

            // ✅ Update genres
            if (updatedMovie.Genres != null)
            {
                // Remove old links
                var existingGenres = _movieContext.MovieGenres.Where(mg => mg.show_id == show_id);
                _movieContext.MovieGenres.RemoveRange(existingGenres);

                // Add new ones
                var newGenreIDs = _movieContext.GenreNames
                    .Where(g => updatedMovie.Genres.Contains(g.GenreName))
                    .Select(g => g.GenreID)
                    .ToList();

                foreach (var genreID in newGenreIDs)
                {
                    _movieContext.MovieGenres.Add(new movie_genre
                    {
                        show_id = show_id,
                        GenreID = genreID
                    });
                }
            }

            _movieContext.SaveChanges();

            return Ok(existingMovie);
        }


        // ✅ Delete a movie
        [HttpDelete("DeleteMovie/{show_id}")]
        [Authorize] // Requires users to be logged in
        public IActionResult DeleteMovie(string show_id)
        {
            var movie = _movieContext.Movies.Find(show_id);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            _movieContext.Movies.Remove(movie);
            _movieContext.SaveChanges();

            return NoContent();
        }
    }
}
