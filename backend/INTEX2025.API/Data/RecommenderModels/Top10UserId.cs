using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data.RecommenderModels;

public class Top10UserId
{
    [Column("show_id")]
    public long ShowId { get; set; }
    
    [Column("distance")]
    public float? Distance { get; set; }
    
    [Column("user_id")]
    public long UserId { get; set; }
}