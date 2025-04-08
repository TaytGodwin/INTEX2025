namespace INTEX.API.Data.RecommenderModels;

public class Top10MovieTitle
{
    public string ShowId { get; set; }
    public string RecommendedId { get; set; }
    public float? Score { get; set; }
}