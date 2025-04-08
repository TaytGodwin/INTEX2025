namespace INTEX.API.Data.RecommenderModels;

using System.ComponentModel.DataAnnotations.Schema;

public class TopMovies
{
    [Column("genre")]
    public string Genre { get; set; }
    
    [Column("title")]
    public string Title { get; set; }
    
    [Column("show_id")]
    public string ShowId { get; set; }
    
    [Column("predicted_rating")]
    public double PredictedRating { get; set; }
}