using System.Security.Claims;
using INTEX.API.Data;
using INTEX.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Azure.Storage.Blobs;

// Load environment variables (useful for development) so that settings are available
// DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure logging to output to console and debug window
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

// Register controllers and endpoints for API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Retrieve connection strings and settings from environment variables
var moviesConnection = Environment.GetEnvironmentVariable("MOVIESCONNECTION"); 
var blobConnectionString = Environment.GetEnvironmentVariable("BLOB_CONNECTION");
var containerName = Environment.GetEnvironmentVariable("CONTAINER_NAME");
var identityConnection = Environment.GetEnvironmentVariable("IDENTITYCONNECTION");

// Configure the Identity database context using the identity connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(identityConnection));

// Configure the Movie database context using the movie connection string
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(moviesConnection));

// Configure the Recommender database context (using SQLite here)
builder.Services.AddDbContext<RecommenderDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("RecommenderConnection")));

// Set up the Azure Blob storage client for image handling
if (string.IsNullOrEmpty(blobConnectionString) || string.IsNullOrEmpty(containerName))
{
    Console.WriteLine("Blob connection string or container name is missing!");
}

var blobServiceClient = new BlobServiceClient(blobConnectionString);
var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);

// Add authentication and identity services
builder.Services.AddAuthorization();
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure Identity options such as password strength and lockout settings
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 13;
    options.Password.RequiredUniqueChars = 2; // Ensures that not all characters are the same
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10); // Lock user out for 10 minutes on too many failed logins
    options.Lockout.MaxFailedAccessAttempts = 5; // Maximum allowed failed login attempts
    options.Lockout.AllowedForNewUsers = true; // Apply lockout rules for new users

    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Store email as the username claim
});

// Register the custom claims principal factory for adding extra claims to Identity users
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

// Configure application cookie settings for secure authentication
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
        // If the request is for an API endpoint, return 401 Unauthorized instead of redirecting
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
        // Otherwise, perform normal redirection to the login page
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

// Configure cookie policy to always require user consent for non-essential cookies
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true; // Always require consent for non-essential cookies
    options.MinimumSameSitePolicy = SameSiteMode.None; // Allow cross-site cookies if needed
});

// Configure Cross-Origin Resource Sharing (CORS) policy for local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://wonderful-smoke-08f7f441e.6.azurestaticapps.net")
                .AllowCredentials() // Cookies enabled with this
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Register a no-operation email sender for Identity (replace with a real implementation in production)
builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

var app = builder.Build();

// Configure the HTTP request pipeline based on the environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger UI in development
    app.UseSwaggerUI();
}
else
{
    app.UseHsts(); // Use HTTP Strict Transport Security in production
}

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS
app.UseRouting(); // Enable routing for the application
app.UseCors("AllowReactApp"); // Apply the configured CORS policy
app.UseCookiePolicy(); // Enforce cookie policy as configured
app.UseAuthentication(); // Enable authentication middleware
app.UseAuthorization(); // Enable authorization middleware

// Map controller endpoints to routes
app.MapControllers();
app.MapControllers().RequireCors("AllowReactApp");
app.MapIdentityApi<IdentityUser>().RequireCors("AllowReactApp"); // Map Identity API with CORS policy

app.Run(); // Run the application
