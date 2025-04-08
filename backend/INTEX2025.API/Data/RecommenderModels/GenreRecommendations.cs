namespace INTEX.API.Data.RecommenderModels;

public class GenreRecommendations
{
    public string ShowId { get; set; }
    public string RecommendedId { get; set; }
    public string Genre { get; set; }
    public float? Score { get; set; }
}