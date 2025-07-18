﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data
{
    [Table("movies_titles")]
    public class movies_title
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int show_id { get; set; }
        [Required]
        public string type { get; set; }
        [Required]
        public string title { get; set; }
        
        public string? director {  get; set; } // Not required
        public string? cast  { get; set; } // Not required
        public string? country { get; set; } // Not requried 
        [Required]
        public int release_year { get; set; }
        [Required]
        public string rating { get; set; }
        [Required]
        public string duration { get; set; }
        [Required]
        public string description { get; set; }

        // ✅ Many-to-many relationship via linking table
        public ICollection<movies_genre> MovieGenres { get; set; }

    }
}
