using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace INTEX.API.Controllers;

public class RoleAssignmentDto
{
    public string UserEmail { get; set; }
    public string RoleName { get; set; }
}
[Route("[controller]")]
[ApiController]
// [Authorize(Roles = "Administrator")] // This means only someone with designated role can use this controller
public class RoleController : Controller
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdentityUser> _userManager;

    public RoleController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }
    
    [HttpPost("AddRole")]
    [Authorize("Administrator")] // Used only by adminstrators
    public async Task<IActionResult> AddRole([FromQuery] string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name cannot be empty.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return Conflict("Role already exists.");
        }

        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' created successfully.");
        }

        return StatusCode(500, "An error occurred while creating the role.");
    }

    [HttpPost("AssignRoleToUser")]
    [Authorize("Administrator")] // Used only by adminstrators
    public async Task<IActionResult> AssignRoleToUser([FromBody] RoleAssignmentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserEmail) || string.IsNullOrWhiteSpace(dto.RoleName))
        {
            return BadRequest("User email and role name are required.");
        }
        var user = await _userManager.FindByEmailAsync(dto.UserEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        var roleExists = await _roleManager.RoleExistsAsync(dto.RoleName);
        if (!roleExists)
        {
            return NotFound("Role does not exist.");
        }
        var result = await _userManager.AddToRoleAsync(user, dto.RoleName);
        if (result.Succeeded)
        {
            return Ok($"Role '{dto.RoleName}' assigned to user '{dto.UserEmail}'.");
        }
        return StatusCode(500, "An error occurred while assigning the role.");
    }
}
