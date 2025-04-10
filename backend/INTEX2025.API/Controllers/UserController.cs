using Microsoft.AspNetCore.Mvc;
using INTEX.API.Data;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace INTEX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _identityContext; // Identity context for user authentication
        private readonly MovieDbContext _movieContext; // Movie context for movies_users table
        private readonly UserManager<IdentityUser> _userManager;

        public UsersController(ApplicationDbContext identityContext, MovieDbContext movieContext, UserManager<IdentityUser> userManager)
        {
            _identityContext = identityContext;
            _movieContext = movieContext;
            _userManager = userManager;
        }

        [HttpPost("CreateUser")] // Creates user upon registering so it is not authorized with an authorize tag
        public async Task<IActionResult> PostUser([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User data is required.");
            }

            if (string.IsNullOrEmpty(userDto.Name) || string.IsNullOrEmpty(userDto.Email))
            {
                return BadRequest("Name and Email are required.");
            }

            // Create the Identity user first
            var identityUser = new IdentityUser
            {
                UserName = userDto.Email,
                Email = userDto.Email
            };

            // var result = await _userManager.CreateAsync(identityUser, userDto.Password);
            // if (!result.Succeeded)
            // {
            //     return BadRequest(result.Errors);
            // }

            // Create the user profile in the movies_users table
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

            // Save the profile data into the movies_users table using MovieDbContext
            _movieContext.MovieUsers.Add(user);
            await _movieContext.SaveChangesAsync();

            return CreatedAtAction(nameof(PostUser), new { id = user.UserId }, user);
        }
    }
}
