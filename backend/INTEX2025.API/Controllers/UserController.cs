using INTEX.API.Data;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("CreateUser")]
    public async Task<IActionResult> PostUser([FromBody] UserDto userDto)
    {
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

        _context.Movies_Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
