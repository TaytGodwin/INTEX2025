import { Genre } from '../types/Genre';
import { Movie } from '../types/Movie';
import { NewMovie } from '../types/NewMovie';

const MOVIE_API_URL = 'https://localhost:5000';
  // 'https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net';

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

export const uploadImage = async (imageName: string, file: File): Promise<boolean> => {
  try {
    const formPayload = new FormData();
    formPayload.append('file', file);
    
    const response = await fetch(`${MOVIE_API_URL}/api/Image/AddImage/${encodeURIComponent(imageName)}`, {
      method: 'POST',
      credentials: 'include',
      body: formPayload,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image uploaded successfully:', data);
    return true;
  } catch (error) {
    console.error('Error uploading image:', error);
    return false;
  }
};

// This call gets all movies and works with pagination
export const getTotalMovies = async (
  pageSize: number = 25,
  pageNum: number = 1,
  sortBy: string = 'title',
  genrelist?: string[]
): Promise<{ movies: Movie[]; totalNumMovies: number }> => {
  try {
    let url = `${MOVIE_API_URL}/api/Movie/AllMovies?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}`;
    if (genrelist && genrelist.length > 0) {
      genrelist.forEach((genre) => {
        url += `&genrelist=${encodeURIComponent(genre)}`;
      });
    }

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    return {
      movies: data.movies,
      totalNumMovies: data.totalNumMovies,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { movies: [], totalNumMovies: 0 };
  }
};

export const searchMovies = async (
  query: string,
  pageSize: number = 25,
  pageNum: number = 1,
  genrelist?: string[]
): Promise<Movie[]> => {
  try {
    let url = `${MOVIE_API_URL}/api/Movie/Search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&pageNum=${pageNum}`;
    if (genrelist && genrelist.length > 0) {
      // Append each genre as a query parameter.
      genrelist.forEach((genre) => {
        url += `&genrelist=${encodeURIComponent(genre)}`;
      });
    }

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    // Make sure this matches your backend; if backend returns "Movies", change accordingly.
    return data.movies;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// GenreAPI.ts

export const getGenres = async (): Promise<Genre[]> => {
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
    // API returns an array of strings (genres)
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

// This will delete a movie
export const deleteMovie = async (ShowIdToDelete: number): Promise<boolean> => {
  try {
    const response = await fetch(`${MOVIE_API_URL}/api/Movie/DeleteMovie`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ShowIdToDelete),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Return true if the movie was successfully deleted
    return true;
  } catch (error) {
    console.error('Error deleting movie:', error);
    return false;
  }
};

// This will publish edits to a movie
export const updateMovie = async (movieToEdit: Movie): Promise<boolean> => {
  try {
    const response = await fetch(`${MOVIE_API_URL}/api/Movie/UpdateMovie`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieToEdit),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Return true if the movie was successfully updated
    return true;
  } catch (error) {
    console.error('Error updating movie:', error);
    return false;
  }
};

export const getUserId = async (email: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `${MOVIE_API_URL}/api/Account/userId?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error('Error fetching user id:', error);
    return null;
  }
};
