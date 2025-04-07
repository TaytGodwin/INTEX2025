using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace INTEX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        // Instance of context file
        private MovieDbContext _movieContext;
        public MovieController(MovieDbContext temp) => _movieContext = temp; // Set instance

        [HttpGet("AllMovies")] // Get all Movies for admin user to see, but technically any authorized user could do this
        [Authorize] // Requires users to be logged in
        public IActionResult GetBooks(int pageSize = 25, int pageNum = 1, string sortBy = "title", [FromQuery] List<string>? categoryTypes = null) // parameters
        {
            // IQueryable are built one thing at a time
            var query = _movieContext.Movies.AsQueryable();

            if (categoryTypes != null && categoryTypes.Any()) // Check if movie categories are not null
            {
                query = query.Where(c => categoryTypes.Contains(c.Category)); // Only get project types when they are in the list
            }

            var AllBooks = query // Narrowed down, filtered list
                .OrderBy(sortBy) // Uses using System.Linq.Dynamic.Core; to sort by the preference that the user gave
                .Skip((pageNum - 1) * pageSize) // Skips the page size amount until it gets to the page you are on
                .Take(pageSize) // Sends how many the user selected
                .ToList();

            var totalNumBooks = query.Count();

            var TotalObject = new
            {
                Books = AllBooks,
                totalNumBooks
            };

            return Ok(TotalObject);
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var AllCategories = _movieContext.Books
                .Select(b => b.Category)
                .Distinct() // Get distinc categories from the books table
                .ToList();

            return Ok(AllCategories);
        }

        // To add books
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook) // Frombody means it is coming in the body as json
        {
            _movieContext.Books.Add(newBook);
            _movieContext.SaveChanges();

            return Ok(newBook);
        }

        // To edit books
        [HttpPut("UpdateBook/{BookId}")]
        public IActionResult UpdateBook(int BookId, [FromBody] Book updatedBook)
        {
            var existingBook = _movieContext.Books.Find(BookId); // Find the project to edit

            // Update everything
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            // Update database with edits
            _movieContext.Books.Update(existingBook);
            _movieContext.SaveChanges();

            return Ok(existingBook);
        }

        // To delete a book
        [HttpDelete("DeleteBook/{BookId}")]
        public IActionResult DeleteBook(int BookId)
        {
            var book = _movieContext.Books.Find(BookId); // Get the book

            if (book == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            // Save changes to database
            _movieContext.Books.Remove(book);
            _movieContext.SaveChanges();

            return NoContent();
        }
    }
}
{
    public class MovieController : Controller
    {
    }
}
