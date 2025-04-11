// NewMovie interface:
// - Represents the data required to add a new movie (excluding show_id)
// - Genres are represented as an array of genre names (strings)
export interface NewMovie {
  title: string;
  type: string;
  director: string;
  cast: string;
  country: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  genres: string[];
}
