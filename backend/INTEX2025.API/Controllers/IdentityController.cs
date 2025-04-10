using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;

namespace INTEX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public IdentityController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
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
        public IActionResult SetCookie()
        {
            const string CookieName = "CookieConsent";

            HttpContext.Response.Cookies.Append(CookieName, "Yes", new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use true if you're on HTTPS
                SameSite = SameSiteMode.None, // ALlows cross-site
                Expires = DateTime.UtcNow.AddDays(7),
                IsEssential = true // ✅ Allows it even if consent is required
            });

            return Ok("Cookie has been set.");
        }



    }
}
