import { Genre } from './Genre';

// Movie interface:
// - Represents a movie or show with metadata such as title, director, cast, and genre list
export interface Movie {
  show_id: number;
  title: string;
  type: string;
  director: string;
  cast: string;
  country: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  genres: Genre[];
}
