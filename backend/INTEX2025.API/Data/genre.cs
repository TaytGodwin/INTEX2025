using System.ComponentModel.DataAnnotations;

public class genre
{
    [Key]
    public int GenreID { get; set; }

    public string GenreName { get; set; }

    public ICollection<movie_genre> Genres { get; set; }
}
