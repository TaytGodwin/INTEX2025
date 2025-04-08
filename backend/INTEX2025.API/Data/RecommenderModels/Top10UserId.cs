namespace INTEX.API.Data.RecommenderModels;

public class Top10UserId
{
    public string ShowId { get; set; }
    public float? Distance { get; set; }
    public int UserId { get; set; }
}