using System.Security.Claims;
using INTEX.API.Data;
using INTEX.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Azure.Storage.Blobs;

DotNetEnv.Env.Load(); // Ensure environment variables are loaded in development


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

// Add services to the container

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get Connection Strings from environment variables
var moviesConnection = Environment.GetEnvironmentVariable("MOVIESCONNECTION"); 
var blobConnectionString = Environment.GetEnvironmentVariable("BLOB_CONNECTION");
var containerName = Environment.GetEnvironmentVariable("CONTAINER_NAME");
var identityConnection = Environment.GetEnvironmentVariable("IDENTITYCONNECTION");


// Configure DB contexts
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(identityConnection));

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(moviesConnection)); // Use the movie connection string from the environment variable

builder.Services.AddDbContext<RecommenderDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("RecommenderConnection")));

// Set up Azure Blob storage client for the images
if (string.IsNullOrEmpty(blobConnectionString) && string.IsNullOrEmpty(containerName))
    {
        Console.WriteLine("Blob connection string or container name is missing!");
    }

var blobServiceClient = new BlobServiceClient(blobConnectionString);
var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);

builder.Services.AddAuthorization();
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 13;
    options.Password.RequiredUniqueChars = 2; // This makes sure they don't type all the same characters
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10); // Locks out user for 10 minutes
    options.Lockout.MaxFailedAccessAttempts = 5; // User  can only try to log in 5 times
    options.Lockout.AllowedForNewUsers = true; // Allows above rules to be the case for new users too

    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true; // Ensures the authentication cookie is not accessible via JavaScript (for security)
    options.Cookie.SameSite = SameSiteMode.None; // Allows cookies to be sent with cross-site requests (needed for some frontend setups)
    options.Cookie.Name = ".AspNetCore.Identity.Application"; // Sets a custom name for the authentication cookie
    options.LoginPath = "/login"; // The path users are redirected to when not authenticated
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensures the cookie is only sent over HTTPS
    options.Cookie.IsEssential = true;
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api")) // Checks if the request is for an API endpoint
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized; // Returns 401 instead of redirecting (for APIs)
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri); // Redirects to login page for non-API requests
        return Task.CompletedTask;
    };
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true; // Always require consent
    options.MinimumSameSitePolicy = SameSiteMode.None; // Allow cross-site cookies (if needed)
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:3030", "http://localhost:3030", "")
                .AllowCredentials() // Cookies enabled with this
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
} else
{ // If it is in production
    app.UseHsts();
}

app.UseHttpsRedirection(); // DO NOT DELETE THIS LINE
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseCookiePolicy(); // This was after the two auth, but I moved it because chat said to
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapIdentityApi<IdentityUser>().RequireCors("AllowReactApp");
app.Run();
