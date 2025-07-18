using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data.RecommenderModels;

public class GenreRecommendations
{
    [Column("show_id")]
    public long ShowId { get; set; }

    [Column("recommended_id")]
    public long RecommendedId { get; set; }

    [Column("genre")]
    public string Genre { get; set; }

    [Column("score")]
    public float Score { get; set; }
}