using INTEX.API.Data;

public class movie_genre
{
    public string show_id { get; set; }
    public int GenreID { get; set; }

    public movies_title Movie { get; set; }
    public genre_name Genre { get; set; }
}
