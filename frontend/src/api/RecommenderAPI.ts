import { Movie } from '../types/Movie';

const Recommender_API_URL = 'https://localhost:5000'
  //'https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net';

// This API call is for the main page. It does not require authorization
// Should return a list of 10 movies
export const getGenreMovies = async (): Promise<Movie[] | null> => {
  try {
    const response = await fetch(
      `${Recommender_API_URL}/api/Recommender/genre_recommendations`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const contentType = response.headers.get('content-type');

    // Ensure the response is JSON
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();

    // Assuming the backend returns a list of MovieUpdateDto objects
    return data as Movie[];
  } catch (error) {
    console.error('Error getting movies based on genre:', error);
    return null;
  }
};
