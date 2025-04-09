import { Movie } from '../types/Movie';
import { NewMovie } from '../types/NewMovie';

const MOVIE_API_URL = 'https://localhost:5000';
//'https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net';

export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${MOVIE_API_URL}/api/Movie/AllMovies`, {
      method: 'GET',
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    return data.movies; // <-- this is the fix
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
// GenreAPI.ts

export const getGenres = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${MOVIE_API_URL}/api/Movie/getgenres`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    // Assuming your API returns an array of strings (genres)
    return data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// This API call adds a movie to the database
export const addMovie = async (MovieToAdd: NewMovie): Promise<boolean> => {
  try {
    const response = await fetch(`${MOVIE_API_URL}/api/Movie/AddMovie`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(MovieToAdd),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // This returns true if the movie was successfully added
    return true;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return false;
  }
};
