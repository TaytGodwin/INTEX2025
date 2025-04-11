// Import necessary namespaces for dynamic queries, data access, authorization, and controller functionality
using System.Linq.Dynamic.Core;
using INTEX.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Added for asynchronous EF Core operations


// Mark this class as an API controller with a route based on the controller's name
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    // Database contexts for accessing user data and movie-related data
    private readonly ApplicationDbContext _context;
    private readonly MovieDbContext _movieDbContext; // Added MovieDbContext

    // Constructor that injects the necessary database contexts
    public AccountController(ApplicationDbContext context, MovieDbContext movieDbContext) // Updated constructor
    {
        _context = context;
        _movieDbContext = movieDbContext;
    }
    
    // GET: api/Account/me
    // This endpoint returns the current logged in user's email and roles.
    [HttpGet("me")]
    [Authorize] // Ensures the request is authenticated
    public IActionResult GetCurrentUser()
    {
        // Retrieve the email of the currently authenticated user
        var email = User.Identity?.Name;

        // Perform a join query to retrieve the user details along with their associated roles
        var userWithRoles = (from u in _context.Users
                             join ur in _context.UserRoles on u.Id equals ur.UserId
                             join r in _context.Roles on ur.RoleId equals r.Id
                             where u.Email == email
                             select new
                             {
                                 Email = u.Email, // User's email address
                                 Roles = new List<string> { r.Name } // List containing the role name
                             }).FirstOrDefault();

        // Return the current user's email and roles as a JSON object
        return Ok(new { email = userWithRoles?.Email, roles = userWithRoles?.Roles });
    }
    
    // GET: api/Account/userId?email=<email>
    // This endpoint retrieves the user ID based on the provided email from the movies_users table
    [HttpGet("userId")]
    public async Task<IActionResult> GetUserIdByEmailAsync(string email)
    {
        // Execute SQL query to retrieve the user_id column for the given email
        var userId = await _movieDbContext.MovieUsers
            .FromSqlInterpolated($"SELECT user_id FROM [dbo].[movies_users] WHERE CAST(email AS nvarchar(max)) = {email}")
            .AsNoTracking()
            .Select(u => u.UserId)
            .FirstOrDefaultAsync();
        
        // If userId is 0, it implies no record was found; return 404 Not Found
        if(userId == 0)
        {
            return NotFound();
        }
        
        // Return the found userId in a JSON object
        return Ok(new { userId });
    }
}