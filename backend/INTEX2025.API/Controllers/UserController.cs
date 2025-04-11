using Microsoft.AspNetCore.Mvc;
using INTEX.API.Data;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace INTEX.API.Controllers
{
    // Mark as API controller and define the route for user-related endpoints
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // ApplicationDbContext for user authentication data
        private readonly ApplicationDbContext _identityContext;
        // MovieDbContext for accessing the movies_users table
        private readonly MovieDbContext _movieContext;
        // UserManager to manage Identity users
        private readonly UserManager<IdentityUser> _userManager;

        // Constructor: Injects the necessary contexts and the UserManager
        public UsersController(ApplicationDbContext identityContext, MovieDbContext movieContext, UserManager<IdentityUser> userManager)
        {
            _identityContext = identityContext; // Context for handling Identity data
            _movieContext = movieContext;       // Context for handling movie user data
            _userManager = userManager;         // Manages Identity user operations
        }

        // POST: api/Users/CreateUser
        // Endpoint to create a new user profile; no authorization is required for user registration
        [HttpPost("CreateUser")]
        public async Task<IActionResult> PostUser([FromBody] UserDto userDto)
        {
            // Validate that userDto is provided
            if (userDto == null)
            {
                return BadRequest("User data is required.");
            }

            // Validate that both Name and Email are provided
            if (string.IsNullOrEmpty(userDto.Name) || string.IsNullOrEmpty(userDto.Email))
            {
                return BadRequest("Name and Email are required.");
            }

            // Create the Identity user instance (for authentication purposes)
            var identityUser = new IdentityUser
            {
                UserName = userDto.Email,
                Email = userDto.Email
            };

            // The Identity user creation is commented out as it may be handled elsewhere
            // Uncomment and adjust the following lines if Identity user creation is needed
            // var result = await _userManager.CreateAsync(identityUser, userDto.Password);
            // if (!result.Succeeded)
            // {
            //     return BadRequest(result.Errors);
            // }

            // Create a new user profile for the movies_users table
            var user = new movies_user()
            {
                name = userDto.Name,
                phone = userDto.Phone,
                age = userDto.Age,
                gender = userDto.Gender,
                city = userDto.City,
                state = userDto.State,
                zip = userDto.Zip,
                Netflix = userDto.Netflix,
                AmazonPrime = userDto.AmazonPrime,
                DisneyPlus = userDto.DisneyPlus,
                ParamountPlus = userDto.ParamountPlus,
                Max = userDto.Max,
                Hulu = userDto.Hulu,
                AppleTV = userDto.AppleTV,
                Peacock = userDto.Peacock,
                email = userDto.Email
            };

            // Add the new user profile to the movies_users table via MovieDbContext
            _movieContext.MovieUsers.Add(user);
            await _movieContext.SaveChangesAsync();

            // Return a Created response with the new user's details; the route 'PostUser' can be used to find this user
            return CreatedAtAction(nameof(PostUser), new { id = user.UserId }, user);
        }
    }
}
