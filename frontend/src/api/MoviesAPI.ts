import { Genre } from '../types/Genre';
import { Movie } from '../types/Movie';
import { NewMovie } from '../types/NewMovie';

const MOVIE_API_URL = 'https://localhost:5000';
// 'https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net';

// Gets an object back full of all movie info
export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    // Gets everything from the movie_title base
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

// Gets the blob of the image file based on the title of the movie passed in as image name
export const loadImage = async (imageName: string): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `${MOVIE_API_URL}/api/Image/GetAdminImage/${encodeURIComponent(imageName)}`,
      { method: 'GET', credentials: 'include' }
    );
    // Returns the file in blob format to pass on to the edit page
    if (!response.ok) {
      console.error(`Failed to load image: ${response.statusText}`);
      return null;
    }

    // Return the blob so you have the actual file object.
    return await response.blob();
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
};

// When Admin edits or adds a move this takes the new or changed titled name as the image name as well as jpg file
export const uploadImage = async (
  imageName: string,
  file: File
): Promise<boolean> => {
  // these are passed on to backend to update filename in blob storage based on movie title and photo storage
  try {
    const formPayload = new FormData();
    formPayload.append('file', file);

    const response = await fetch(
      `${MOVIE_API_URL}/api/Image/AddImage/${encodeURIComponent(imageName)}`,
      {
        method: 'POST',
        credentials: 'include',
        body: formPayload,
      }
    );

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

// This call gets all movies and works with pagination. Sets defaults
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

// Manages the search query for movies using defaults for page size and number of page
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
    // Get's back the movie info in list of lists
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

// For genre filtering we need to get a list of genres that exist. Nothing is passed
export const getGenres = async (): Promise<Genre[]> => {
  try {
    // Recieves a list of the genres
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
    // Takes movie object information from form and sends to backend for processing into database
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
    } else {
      console.log(`Added movie to database: ${MovieToAdd}`);
    }
    // This returns true if the movie was successfully added
    return true;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return false;
  }
};

// When a movie is deleted this also needs to run to delete the image
export const deleteImage = async (imageName: string): Promise<boolean> => {
  try {
    // To access the movie we need to get the movie title (here as image name) to find it in blob storay
    const response = await fetch(
      `${MOVIE_API_URL}/api/Image/DeleteImage/${encodeURIComponent(imageName)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    // Returns only success/failure
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// This will delete a movie
export const deleteMovie = async (ShowIdToDelete: number): Promise<boolean> => {
  try {
    // Take show_id to delete all information on that movie or tv show in the movies_titles
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
    // Need object of movie data to PUT the data in the movies_titles
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
    console.log(`Movie ${movieToEdit.title} updated`);
    // Return true if the movie was successfully updated
    return true;
  } catch (error) {
    console.error('Error updating movie:', error);
    return false;
  }
};

// This helps us know which user is logged in
export const getUserId = async (email: string): Promise<number | null> => {
  try {
    // Takes email from auth and returns the id for the user
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
    // Returns just userId. For ratings in modals
    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error('Error fetching user id:', error);
    return null;
  }
};

// Takes the user_id of logeged in user to get back the email
export const getUserName = async (user_id: any): Promise<string> => {
  try {
    const response = await fetch(
      `${MOVIE_API_URL}/api/Account/GetUserName?user_id=${encodeURIComponent(user_id)}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user id:', error);
    throw error;
  }
};
