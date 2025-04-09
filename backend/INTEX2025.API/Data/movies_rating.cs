using System.ComponentModel.DataAnnotations;

namespace INTEX.API.Data
{
    public class movies_rating
    {
        [Required]
        public int user_id { get; set; } = default!;
        [Required]
        public int show_id { get; set; } = default!;
        [Required]
        public int rating { get; set; }
    }
}
