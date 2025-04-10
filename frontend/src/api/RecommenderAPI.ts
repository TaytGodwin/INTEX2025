import { Movie } from '../types/Movie';

const Recommender_API_URL = 'https://localhost:5000';
//'https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net';

// This API call is for the main page. It does not require authorization
// Should return a list of 10 movies pass one genre and get back stuff
export const getGenreMovies = async (
  genre: string
): Promise<Movie[] | null> => {
  try {
    const response = await fetch(
      `${Recommender_API_URL}/api/Recommender/genre_recommendations?genreName=${encodeURIComponent(genre)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching genre recommendations:', error);
    return null;
  }
};
