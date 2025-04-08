using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data.RecommenderModels;

public class Top10MovieTitle
{
    [Column("show_id")]
    public string ShowId { get; set; }
    
    [Column("recommended_id")]
    public string RecommendedId { get; set; }
    
    [Column("score")]
    public float? Score { get; set; }
}