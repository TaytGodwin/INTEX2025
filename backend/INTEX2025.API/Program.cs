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
var identityConnection = Environment.GetEnvironmentVariable("IdentityConnection");


// Configure DB contexts
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(identityConnection));

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(moviesConnection)); // Use the movie connection string from the environment variable

builder.Services.AddDbContext<RecommenderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("RecommenderConnection")));

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
    //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10); // Locks out user for 10 minutes
    //options.Lockout.MaxFailedAccessAttempts = 5; // User  can only try to log in 5 times
    //options.Lockout.AllowedForNewUsers = true; // Allows above rules to be the case for new users too

    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:3030", "http://localhost:3030", "https://jolly-island-0713d9a1e.6.azurestaticapps.net")
                .AllowCredentials()
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
}

app.UseHttpsRedirection(); // DO NOT DELETE THIS LINE
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy();
app.MapControllers();
app.MapIdentityApi<IdentityUser>().RequireCors();
app.Run();
