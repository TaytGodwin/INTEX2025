// api/GenreAPI.ts
import { Genre } from '../types/Genre';

const MOVIE_API_URL = 'https://localhost:5000'; // Change if needed

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${MOVIE_API_URL}/api/Movie/GetGenres`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }

    const data: string[] = await response.json();

    // Convert string[] into Genre[] format
    const genres: Genre[] = data.map((name, index) => ({
      genreID: index,
      genreName: name,
    }));

    return genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};
