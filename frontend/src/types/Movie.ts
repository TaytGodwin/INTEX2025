import { Genre } from './Genre';

export interface Movie {
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
