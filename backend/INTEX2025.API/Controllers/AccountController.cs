using System.Linq.Dynamic.Core;
using INTEX.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Added for asynchronous EF Core operations

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly MovieDbContext _movieDbContext; // Added MovieDbContext

    public AccountController(ApplicationDbContext context, MovieDbContext movieDbContext) // Updated constructor
    {
        _context = context;
        _movieDbContext = movieDbContext;
    }
    
    [HttpGet("me")]
    [Authorize] // Just makes sure they are logged in and then finds their role
    public IActionResult GetCurrentUser()
    {
        // This will return the roles of the person logged in
        var email = User.Identity?.Name;

        var userWithRoles = (from u in _context.Users
                             join ur in _context.UserRoles on u.Id equals ur.UserId
                             join r in _context.Roles on ur.RoleId equals r.Id
                             where u.Email == email
                             select new
                             {
                                 Email = u.Email,
                                 Roles = new List<string> { r.Name }
                             }).FirstOrDefault();

        return Ok(new { email = userWithRoles?.Email, roles = userWithRoles?.Roles });
    }
    
    [HttpGet("userId")]
    public async Task<IActionResult> GetUserIdByEmailAsync(string email)
    {
        // Select only the user_id column to avoid mapping boolean columns
        var userId = await _movieDbContext.MovieUsers
            .FromSqlInterpolated($"SELECT user_id FROM [dbo].[movies_users] WHERE CAST(email AS nvarchar(max)) = {email}")
            .AsNoTracking()
            .Select(u => u.UserId)
            .FirstOrDefaultAsync();
        
        // Assuming UserId is an identity and 0 means no record found
        if(userId == 0)
        {
            return NotFound();
        }
        
        return Ok(new { userId }); // Updated return statement
    }

    [HttpGet("GetUserName")]
    public async Task<IActionResult> GetUserName(int user_id)
    {
        // Select only the user name for the given user_id
        var userName = await _movieDbContext.MovieUsers
            .Where(u => u.UserId == user_id)
            .Select(u => u.name)
            .FirstOrDefaultAsync();

        // If no user is found, return a proper message or response
        if (userName == null)
        {
            return NotFound("User not found in CineNiche");
        }

        // Return the username if found
        return Ok(userName);
    }

}