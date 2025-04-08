using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data.RecommenderModels;

public class Top5ShowIds
{
    [Column("index")]
    public string Index { get; set; }
    
    [Column("If you like")]
    public string IfYouLike { get; set; }
    
    [Column("Recommendation 1")]
    public string Recommendation1 { get; set; }
    
    [Column("Recommendation 2")]
    public string Recommendation2 { get; set; }
    
    [Column("Recommendation 3")]
    public string Recommendation3 { get; set; }
    
    [Column("Recommendation 4")]
    public string Recommendation4 { get; set; }
    
    [Column("Recommendation 5")]
    public string Recommendation5 { get; set; }
}