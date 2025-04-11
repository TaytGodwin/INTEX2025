using System.Security.Claims;
using INTEX.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace INTEX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _ApplicationContext;

        public IdentityController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _ApplicationContext = context;
        }

        public class LoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public bool RememberMe { get; set; }
        }

        // [HttpPost("login")]
        // public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        // {
        //     var user = await _userManager.FindByEmailAsync(loginDto.Email);
        //     if (user == null) return Unauthorized("Invalid credentials");
        //
        //     var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);
        //     if (!result.Succeeded) return Unauthorized("Invalid credentials");
        //
        //     return Ok(new { message = "Login successful" });
        //}

        [HttpPost("logout")]
        [Authorize] // Can be any role
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            // Remove the identity cookie
            Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new { message = "Logout successful" });
        }

        [HttpGet("pingauth")]
        [Authorize] // They have to be logged in, and this checks whether or not they are. If error, they are no longer a valid logged in user
        public async Task<IActionResult> PingAuth()
        {
            if (!User.Identity?.IsAuthenticated ?? false)
            {
                return Unauthorized();
            }

            var email = User.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
            var user = await _userManager.FindByEmailAsync(email);
            var roles = user != null ? await _userManager.GetRolesAsync(user) : new List<string>();

            return Ok(new { email, roles });
        }

        // This doesn't require authorization and stores the users consent to store cookies
        [HttpGet("SetCookie")]
        public IActionResult SetCookie([FromQuery] bool consent)
        {
            const string CookieName = "CookieConsent";
            string consentAnswer = "No";

            // Check consent value and set or delete cookie accordingly
            if (consent)
            {
                consentAnswer = "Yes";
            }
                HttpContext.Response.Cookies.Append(CookieName, consentAnswer, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Use true if you're using HTTPS
                    SameSite = SameSiteMode.None, // Allows cross-site requests
                    Expires = DateTime.UtcNow.AddDays(30),
                    IsEssential = true
                });

                return Ok("Cookie has been set.");
        }

        [HttpPost("isEmailUsed")]
        public async Task<IActionResult> IsEmailUsed([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            // Check if the email already exists in the database
            var emailExists = await _ApplicationContext.Users
                .AnyAsync(user => user.Email == email); // Check against the Identity User table

            return Ok(new { exists = emailExists });
        }

    }
}
