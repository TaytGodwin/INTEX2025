using System.Linq.Dynamic.Core;
using INTEX.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
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
}