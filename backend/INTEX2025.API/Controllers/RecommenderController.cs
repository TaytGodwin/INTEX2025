using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX.API.Data;

namespace INTEX.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RecommenderController : ControllerBase
{
    private readonly RecommenderDbContext _context;

    public RecommenderController(RecommenderDbContext context)
    {
        _context = context;
    }

    [HttpGet("content_recs1")]
    public async Task<IActionResult> GetContentRecs1()
    {
        var data = await _context.ContentRecs1.ToListAsync();
        return Ok(data);
    }

    [HttpGet("genre_recommendations")]
    public async Task<IActionResult> GetGenreRecommendations()
    {
        var data = await _context.GenreRecommendations.ToListAsync();
        return Ok(data);
    }

    [HttpGet("top10_movietitle")]
    public async Task<IActionResult> GetTop10MovieTitles()
    {
        var data = await _context.Top10MovieTitles.ToListAsync();
        return Ok(data);
    }

    [HttpGet("top10_userId")]
    public async Task<IActionResult> GetTop10UserIds()
    {
        var data = await _context.Top10UserIds.ToListAsync();
        return Ok(data);
    }

    [HttpGet("top5_showIds")]
    public async Task<IActionResult> GetTop5ShowIds()
    {
        var data = await _context.Top5ShowIds.ToListAsync();
        return Ok(data);
    }

    [HttpGet("topmovies")]
    public async Task<IActionResult> GetTopMovies()
    {
        var data = await _context.TopMovies.ToListAsync();
        return Ok(data);
    }
}