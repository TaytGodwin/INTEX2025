[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostUser([FromBody] userDto userDto)
    {
        var user = new User
        {
            Name = userDto.Name,
            Phone = userDto.Phone,
            Age = userDto.Age,
            Gender = userDto.Gender,
            City = userDto.City,
            State = userDto.State,
            Zip = userDto.Zip,
            Netflix = userDto.Netflix,
            AmazonPrime = userDto.AmazonPrime,
            DisneyPlus = userDto.DisneyPlus,
            ParamountPlus = userDto.ParamountPlus,
            Max = userDto.Max,
            Hulu = userDto.Hulu,
            AppleTV = userDto.AppleTV,
            Peacock = userDto.Peacock,
            Email = userDto.Email
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
