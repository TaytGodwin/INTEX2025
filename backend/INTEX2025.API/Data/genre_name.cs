using System.ComponentModel.DataAnnotations;

public class genre_name
{
    [Key]
    public int GenreID { get; set; }

    public string GenreName { get; set; }

    public ICollection<movies_genre> Genres { get; set; }
}
