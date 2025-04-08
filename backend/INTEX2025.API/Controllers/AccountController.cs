using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    [HttpGet("me")]
    [Authorize] // ensures only logged-in users can access
    public IActionResult GetCurrentUser()
    {
        var user = User.Identity?.Name;
        var role = User.IsInRole("Administrator") ? "Administrator" : "User";

        return Ok(new { user, role });
    }
}