using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data
{
    [Table("movies_user")]
    public class movies_user
    {
        [Key]
        [Column("user_id")]
        public int UserId{ get; set; }

        [Required]
        public string name { get; set; }

        [Required]
        public string phone { get; set; }

        [Required]
        public string email { get; set; }

        [Required]
        public int age { get; set; }

        [Required]
        public string gender { get; set; }

        [Required]
        public bool Netflix { get; set; }

        [Required]
        [Column("Amazon Prime")]
        public bool AmazonPrime { get; set; }

        [Required]
        [Column("Disney+")]
        public bool DisneyPlus { get; set; }

        [Required]
        [Column("Paramount+")]
        public bool ParamountPlus { get; set; }

        [Required]
        [Column("Max")]
        public bool Max { get; set; }

        [Required]
        public bool Hulu { get; set; }

        [Required]
        [Column("Apple TV+")]
        public bool AppleTV { get; set; }

        [Required]
        public bool Peacock { get; set; }

        [Required]
        public string city { get; set; }

        [Required]
        public string state { get; set; }

        [Required]
        public int zip { get; set; }

    }
}
