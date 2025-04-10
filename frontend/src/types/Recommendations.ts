import { Movie } from './Movie';

export interface ContentRecGroup {
  baseShowId: number;
  recommendations: Movie[];
}