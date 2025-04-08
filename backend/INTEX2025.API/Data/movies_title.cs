using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data
{
    public class movies_title
    {
        [Key]
        [Required]
        public string show_id { get; set; }
        [Required]
        public string type { get; set; }
        [Required]
        public string title { get; set; }
        
        public string director {  get; set; } // Not required
        public string cast  { get; set; } // Not required
        public string country { get; set; } // Not requried 
        [Required]
        public int release_year { get; set; }
        [Required]
        public string rating { get; set; }
        [Required]
        public string duration { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public int GenreID { get ; set; }

        // ✅ Many-to-many relationship via linking table
        public ICollection<movie_genre> MovieGenres { get; set; }

    }
}
