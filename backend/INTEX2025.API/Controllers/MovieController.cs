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
        private readonly string _connectionString;
        private readonly string _containerName;

        public MovieController(MovieDbContext context, IConfiguration configuration)
        {
            _movieContext = context;
            _connectionString = configuration["ConnectionStrings:AzureBlobStorage:ConnectionString"];
            _containerName = configuration["ConnectionStrings:AzureBlobStorage:ContainerName"];
        }



        [HttpGet("Test")]
        public IActionResult Test()
        {
            return Ok("I am working");
        }

        [HttpGet("AllMovies")]
        public IActionResult GetMovies(int pageSize = 25, int pageNum = 1, string sortBy = "title", [FromQuery] List<string>? genrelist = null)
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

            var allowedSortFields = new[] { "title", "release_year", "rating", "duration" };
            if (!allowedSortFields.Contains(sortBy))
            {
                sortBy = "title";
            }

            var AllMovies = query
                .OrderBy(sortBy)
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
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;
            
            // Remove old links
            var existingGenres = _movieContext.MovieGenres.Where(mg => mg.show_id == show_id);
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


        // This allows you to upload an image
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var blobServiceClient = new BlobServiceClient(_connectionString);
                var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);

                // Create the container if it doesn't exist
                await containerClient.CreateIfNotExistsAsync();

                // Optional: make blobs publicly accessible (for URL access)
                await containerClient.SetAccessPolicyAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

                // Use the original filename OR generate your own (below we're using the original filename)
                var blobClient = containerClient.GetBlobClient(file.FileName);

                // Upload and overwrite if the blob already exists
                using (var stream = file.OpenReadStream()){
                await blobClient.UploadAsync(stream, overwrite: true);}

                return Ok(new { url = blobClient.Uri.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Upload failed: {ex.Message}");
            }
        }

    }
}
