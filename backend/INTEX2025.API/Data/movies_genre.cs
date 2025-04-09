using System.ComponentModel.DataAnnotations.Schema;
using INTEX.API.Data;

[Table("movies_genres")]
public class movies_genre
{
    [Column("show_id")] // 👈 ensures EF maps to this DB column
    public int show_id { get; set; }

    [Column("GenreID")] // 👈 explicitly matches your DB column
    public int GenreID { get; set; }

    [ForeignKey("show_id")]
    public movies_title Movie { get; set; }

    [ForeignKey("GenreID")]
    public genre_name Genre { get; set; }
}
