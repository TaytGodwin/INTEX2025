using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace INTEX.API.Services;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<IdentityUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor) { }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        // Always include email
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? ""));

        // ✅ Add roles as claims so [Authorize(Roles = "...")] works
        var roles = await UserManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }

        return identity;
    }
}
