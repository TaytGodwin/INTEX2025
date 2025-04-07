using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data
{
    public class movies_titles
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
        public string countery { get; set; } // Not requried 
        [Required]
        public int release_year { get; set; }
        [Required]
        public string rating { get; set; }
        [Required]
        public string duration { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public bool Action { get; set; }
        [Required]
        public bool Adventure { get; set; }
        [Column("Anime Series International TV Shows")]
        [Required]
        public bool AnimeSeriesInternationalTVShows { get; set; }

        [Column("British TV Shows Docuseries International TV Shows")]
        [Required]
        public bool BritishTVShowsDocuseriesInternationalTVShows { get; set; }

        [Required]
        public bool Children { get; set; }

        [Required]
        public bool Comedies { get; set; }

        [Column("Comedies Dramas International Movies")]
        [Required]
        public bool ComediesDramasInternationalMovies { get; set; }

        [Column("Comedies International Movies")]
        [Required]
        public bool ComediesInternationalMovies { get; set; }

        [Column("Comedies Romantic Movies")]
        [Required]
        public bool ComediesRomanticMovies { get; set; }

        [Column("Crime TV Shows Docuseries")]
        [Required]
        public bool CrimeTVShowsDocuseries { get; set; }

        [Required]
        public bool Documentaries { get; set; }

        [Column("Documentaries International Movies")]
        [Required]
        public bool DocumentariesInternationalMovies { get; set; }

        [Required]
        public bool Docuseries { get; set; }

        [Required]
        public bool Dramas { get; set; }

        [Column("Dramas International Movies")]
        [Required]
        public bool DramasInternationalMovies { get; set; }

        [Column("Dramas Romantic Movies")]
        [Required]
        public bool DramasRomanticMovies { get; set; }

        [Column("Family Movies")]
        [Required]
        public bool FamilyMovies { get; set; }

        [Required]
        public bool Fantasy { get; set; }

        [Column("Horror Movies")]
        [Required]
        public bool HorrorMovies { get; set; }

        [Column("International Movies Thrillers")]
        [Required]
        public bool InternationalMoviesThrillers { get; set; }

        [Column("International TV Shows Romantic TV Shows TV Dramas")]
        [Required]
        public bool InternationalTVShowsRomanticTVShowsTVDramas { get; set; }

        [Column("Kids' TV")]
        [Required]
        public bool KidsTV { get; set; }

        [Column("Language TV Shows")]
        [Required]
        public bool LanguageTVShows { get; set; }

        [Required]
        public bool Musicals { get; set; }

        [Column("Nature TV")]
        [Required]
        public bool NatureTV { get; set; }

        [Column("Reality TV")]
        [Required]
        public bool RealityTV { get; set; }

        [Required]
        public bool Spirituality { get; set; }

        [Column("TV Action")]
        [Required]
        public bool TVAction { get; set; }

        [Column("TV Comedies")]
        [Required]
        public bool TVComedies { get; set; }

        [Column("TV Dramas")]
        [Required]
        public bool TVDramas { get; set; }

        [Column("Talk Shows TV Comedies")]
        [Required]
        public bool TalkShowsTVComedies { get; set; }

        [Required]
        public bool Thrillers { get; set; }

    }
}
