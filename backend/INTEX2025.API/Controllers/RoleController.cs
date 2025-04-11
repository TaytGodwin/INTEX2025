using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace INTEX.API.Controllers;

// DTO used to pass data for assigning a role to a user
public class RoleAssignmentDto
{
    public string UserEmail { get; set; } // The email address of the user to whom the role will be assigned
    public string RoleName { get; set; }  // The name of the role to assign
}

// Define the base route and mark this as an API controller
[Route("[controller]")]
[ApiController]
// [Authorize(Roles = "Administrator")] // Uncomment this to restrict the entire controller to Administrators
public class RoleController : Controller
{
    // RoleManager handles operations related to roles
    private readonly RoleManager<IdentityRole> _roleManager;
    // UserManager handles operations related to users
    private readonly UserManager<IdentityUser> _userManager;

    // Constructor that injects RoleManager and UserManager
    public RoleController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }
    
    // POST: RoleController/AddRole
    // Creates a new role if it does not already exist
    [HttpPost("AddRole")]
    [Authorize(Roles = "Administrator")] // Only administrators can create roles
    public async Task<IActionResult> AddRole([FromQuery] string roleName)
    {
        // Validate that the role name is not empty
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name cannot be empty.");
        }

        // Check if the role already exists
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return Conflict("Role already exists.");
        }

        // Create the new role
        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' created successfully.");
        }

        // If there was an error during creation, return a 500 error
        return StatusCode(500, "An error occurred while creating the role.");
    }

    // POST: RoleController/AssignRoleToUser
    // Assigns an existing role to a user
    [HttpPost("AssignRoleToUser")]
    // [Authorize] // Cannot require authorization here if the user is not logged in; adjust as needed
    public async Task<IActionResult> AssignRoleToUser([FromBody] RoleAssignmentDto dto)
    {
        // Validate input: both user email and role name must be provided
        if (string.IsNullOrWhiteSpace(dto.UserEmail) || string.IsNullOrWhiteSpace(dto.RoleName))
        {
            return BadRequest("User email and role name are required.");
        }

        // Find the user by their email
        var user = await _userManager.FindByEmailAsync(dto.UserEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Verify that the role exists
        var roleExists = await _roleManager.RoleExistsAsync(dto.RoleName);
        if (!roleExists)
        {
            return NotFound("Role does not exist.");
        }

        // Assign the role to the user
        var result = await _userManager.AddToRoleAsync(user, dto.RoleName);
        if (result.Succeeded)
        {
            return Ok($"Role '{dto.RoleName}' assigned to user '{dto.UserEmail}'.");
        }

        // Return an error if role assignment failed
        return StatusCode(500, "An error occurred while assigning the role.");
    }
}
