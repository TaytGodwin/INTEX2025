namespace INTEX.API.Data
{
    public class MovieUpdateDto
    {
        public int show_id {  get; set; }
        public string title { get; set; }
        public string type { get; set; }
        public string director { get; set; }
        public string cast { get; set; }
        public string country { get; set; }
        public int release_year { get; set; }
        public string rating { get; set; }
        public string duration { get; set; }
        public string description { get; set; }

        public List<string> Genres { get; set; }  // Genre names
    }

}
