using System.ComponentModel.DataAnnotations.Schema;
using INTEX.API.Data;

[Table("movies_genres")]
public class movies_genre
{
    public int show_id { get; set; }
    public int GenreID { get; set; }

    [ForeignKey("show_id")]
    public movies_title Movie { get; set; }
    [ForeignKey("GenreID")]
    public genre_name Genre { get; set; }
}
