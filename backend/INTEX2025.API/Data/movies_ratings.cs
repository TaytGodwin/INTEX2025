using System.ComponentModel.DataAnnotations;

namespace INTEX.API.Data
{
    public class movies_ratings
    {
        [Required]
        public int user_id { get; set; }
        [Required]
        public string show_id { get; set; }
        [Required]
        public int rating { get; set; }
    }
}
