using System.Security.Claims;
using INTEX.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace INTEX.API.Controllers
{
    // Mark this class as an API controller and set its route.
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        // Managers for signing in and user operations, as well as the application database context.
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _ApplicationContext;

        // Constructor that injects the required services.
        public IdentityController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _ApplicationContext = context;
        }

        // DTO for login operation data
        public class LoginDto
        {
            public string Email { get; set; } // Email for login
            public string Password { get; set; } // Password for login
            public bool RememberMe { get; set; } // Whether to remember the user across sessions
        }

        // The login endpoint is commented out. Uncomment and configure when login functionality is needed.
        // [HttpPost("login")]
        // public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        // {
        //     // Find user by email
        //     var user = await _userManager.FindByEmailAsync(loginDto.Email);
        //     if (user == null) return Unauthorized("Invalid credentials");
        //
        //     // Attempt to sign the user in
        //     var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);
        //     if (!result.Succeeded) return Unauthorized("Invalid credentials");
        //
        //     // Return success message if login is successful
        //     return Ok(new { message = "Login successful" });
        // }

        // POST: api/Identity/logout
        // This endpoint logs the user out and deletes the authentication cookie.
        [HttpPost("logout")]
        [Authorize] // Ensures the user is authenticated
        public async Task<IActionResult> Logout()
        {
            // Sign out the user
            await _signInManager.SignOutAsync();

            // Remove the identity cookie by deleting it from the response
            Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            // Return a success message
            return Ok(new { message = "Logout successful" });
        }

        // GET: api/Identity/pingauth
        // This endpoint checks if the user is authenticated and retrieves user details like email and roles.
        [HttpGet("pingauth")]
        [Authorize] // Ensures the user is logged in
        public async Task<IActionResult> PingAuth()
        {
            // Check if the user identity is authenticated; if not, return unauthorized response.
            if (!User.Identity?.IsAuthenticated ?? false)
            {
                return Unauthorized();
            }

            // Retrieve the user's email from their claims or use a default value
            var email = User.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";

            // Find the user in the database by email
            var user = await _userManager.FindByEmailAsync(email);
            // If user exists, retrieve their roles; otherwise, return an empty list
            var roles = user != null ? await _userManager.GetRolesAsync(user) : new List<string>();

            // Return the user's email and roles
            return Ok(new { email, roles });
        }

        // GET: api/Identity/SetCookie
        // This endpoint sets a cookie indicating the user's consent to store cookies, not requiring authorization.
        [HttpGet("SetCookie")]
        public IActionResult SetCookie()
        {
            const string CookieName = "CookieConsent";

            // Append a cookie with consent set to 'Yes' and appropriate security options
            HttpContext.Response.Cookies.Append(CookieName, "Yes", new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use true if on HTTPS
                SameSite = SameSiteMode.None, // Allows cross-site usage
                Expires = DateTime.UtcNow.AddDays(7),
                IsEssential = true // Marks the cookie as essential
            });

            // Return a confirmation message
            return Ok("Cookie has been set.");
        }

        // POST: api/Identity/isEmailUsed
        // This endpoint checks if an email is already registered in the Identity User database.
        [HttpPost("isEmailUsed")]
        public async Task<IActionResult> IsEmailUsed([FromBody] string email)
        {
            // Validate that the email value is provided; return a bad request if missing
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            // Check the database for any user with the provided email
            var emailExists = await _ApplicationContext.Users
                .AnyAsync(user => user.Email == email); // Check against the Identity User table

            // Return a JSON response indicating whether the email exists
            return Ok(new { exists = emailExists });
        }
    }
}
