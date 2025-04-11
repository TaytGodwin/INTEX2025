using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace INTEX.API.Services;

// CustomUserClaimsPrincipalFactory extends the default functionality to include custom claims.
// This class is responsible for generating a ClaimsPrincipal for an IdentityUser during sign-in and adding additional claims such as email and roles.
public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<IdentityUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor) { }

    // Override GenerateClaimsAsync to add custom claims to the user's identity.
    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
    {
        // Generate the base identity with the default claims (e.g., user Id)
        var identity = await base.GenerateClaimsAsync(user);

        // Always include the user's email as a claim for identification and communication purposes.
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? ""));

        // Retrieve the roles for the user and add each role as a claim.
        // Adding roles as claims enables role-based authorization via [Authorize(Roles = "...")].
        var roles = await UserManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            // Add each role to the claims identity as a role claim.
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }

        // Return the claims identity with additional custom claims added.
        return identity;
    }
}
