using System.Security.Claims;
using INTEX.API.Data;
using INTEX.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Azure.Storage.Blobs;

DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MoviesConnection")));

builder.Services.AddDbContext<RecommenderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("RecommenderConnection")));

// This is for images
var blobConnectionString = Environment.GetEnvironmentVariable("AZUREBLOBSTORAGE__BLOB_CONNECTION");
var containerName = Environment.GetEnvironmentVariable("AZUREBLOBSTORAGE__CONTAINERNAME");
Console.WriteLine($"Blob Connection String: {containerName}");

var blobServiceClient = new BlobServiceClient(blobConnectionString);
var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);



builder.Services.AddAuthorization();

// This code above is replaced by the one below for using roles
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    // The following lines change Microsoft's password requirements
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 13; // This is the required length of the password
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
    options.Cookie.SameSite = SameSiteMode.None; // Adjust as needed for production
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Necessary for identity cookies in production

    // Prevent API calls from being redirected to the login page by returning a 401
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

    // ✅ Dynamically switch SecurePolicy based on environment
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:3030", "http://localhost:3030", "https://jolly-island-0713d9a1e.6.azurestaticapps.net") // This needs to be the right port
                .AllowCredentials() // Cookies needs this
                .AllowAnyHeader()
                .AllowAnyMethod(); // Lets you do post, delete, put, get, etc
        });
});

builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // redirects https redirection DON'T DELETE THIS LINE


app.UseRouting(); // ✅ Always BEFORE CORS & Auth

app.UseCors("AllowReactApp"); // ✅ CORS must come BEFORE Auth

app.UseAuthentication(); // ✅ Then Auth
app.UseAuthorization();

app.UseCookiePolicy(); // ✅ Cookie policy can be before or after Auth (before is safe)

app.MapControllers(); // ✅ Map Controllers

app.MapIdentityApi<IdentityUser>().RequireCors("AllowReactApp"); // ✅ This maps Identity + CORS

app.Run();

