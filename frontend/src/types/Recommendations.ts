import { Movie } from './Movie';
// ContentRecGroup interface:
// - Represents a group of recommended movies based on a specific base show
// - Contains the base show's ID and a list of recommended Movie objects

export interface ContentRecGroup {
  baseShowId: number;
  recommendations: Movie[];
}