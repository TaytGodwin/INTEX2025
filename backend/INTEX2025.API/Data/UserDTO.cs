using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX.API.Data
{
    [Table("movies_users")] // Assuming the table in the database is called "Users"
    public class UserDto
    {
        [Key]
        [Column("user_id")] // Explicitly matching database column name "UserId"
        public int UserId { get; set; }

        [Required]
        [Column("name")] // Explicitly matching database column name "Name"
        public string Name { get; set; }

        [Required]
        [Column("phone")] // Explicitly matching database column name "Phone"
        public string Phone { get; set; }

        [Required]
        [Column("email")] // Explicitly matching database column name "Email"
        public string Email { get; set; }

        [Required]
        [Column("age")] // Explicitly matching database column name "Age"
        public int Age { get; set; }

        [Required]
        [Column("gender")] // Explicitly matching database column name "Gender"
        public string Gender { get; set; }

        [Required]
        [Column("city")] // Explicitly matching database column name "City"
        public string City { get; set; }

        [Required]
        [Column("state")] // Explicitly matching database column name "State"
        public string State { get; set; }

        [Required]
        [Column("zip")] // Explicitly matching database column name "Zip"
        public int Zip { get; set; }

        [Column("Netflix")] // Explicitly matching database column name "Netflix"
        public bool Netflix { get; set; }

        [Column("Amazon Prime")] // Explicitly matching database column name "AmazonPrime"
        public bool AmazonPrime { get; set; }

        [Column("Disney+")] // Explicitly matching database column name "DisneyPlus"
        public bool DisneyPlus { get; set; }

        [Column("Paramount+")] // Explicitly matching database column name "ParamountPlus"
        public bool ParamountPlus { get; set; }

        [Column("Max")] // Explicitly matching database column name "Max"
        public bool Max { get; set; }

        [Column("Hulu")] // Explicitly matching database column name "Hulu"
        public bool Hulu { get; set; }

        [Column("AppleTV+")] // Explicitly matching database column name "AppleTV"
        public bool AppleTV { get; set; }

        [Column("Peacock")] // Explicitly matching database column name "Peacock"
        public bool Peacock { get; set; }
    }
}
