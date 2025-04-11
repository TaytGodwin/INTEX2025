import { Movie } from '../types/Movie';
import { ContentRecGroup } from '../types/Recommendations';

const Recommender_API_URL = 'https://localhost:5000';
  //'https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net';

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

// MAIN PAGE API 

export const getContentRecs = async (
  userId: number
): Promise<ContentRecGroup[] | null> => {
  try {
    const response = await fetch(
      `${Recommender_API_URL}/api/Recommender/content_recs1?userId=${userId}`,
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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    return data as ContentRecGroup[];
  } catch (error) {
    console.error('Error fetching content recommendations:', error);
    return null;
  }
};



// export const getContentRecs = async (
//   showId: number
// ): Promise<Movie[] | null> => {
//   try {
//     const response = await fetch(
//       `${Recommender_API_URL}/api/Recommender/content_recs1?showId=${showId}`,
//       {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const contentType = response.headers.get('content-type');
//     if (!contentType || !contentType.includes('application/json')) {
//       throw new Error('Invalid response format from server');
//     }

//     const data = await response.json();
//     return data as Movie[];
//   } catch (error) {
//     console.error('Error fetching content recommendations:', error);
//     return null;
//   }
// };

// Gets the for you page calls your top 10 recommended by userID

export const getForYou = async (userId: number): Promise<Movie[] | null> => {
  try {
    const response = await fetch(
      `${Recommender_API_URL}/api/Recommender/top10_userId?userId=${userId}`,
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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    return data as Movie[];
  } catch (error) {
    console.error('Error fetching content recommendations:', error);
    return null;
  }
};


// IN MOVIE DETAIL PAGE
//Gets top 5 handpicked off of a different filtering system
export const getTopRec = async (showId: number): Promise<Movie[] | null> => {
  try {
    const response = await fetch(
      `${Recommender_API_URL}/api/Recommender/top5_showIds?showId=${showId}`,
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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    return data as Movie[];
  } catch (error) {
    console.error('Error fetching content recommendations:', error);
    return null;
  }
};


// FAVORITES 

export const getFavorites = async (userId: number): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${Recommender_API_URL}/api/recommender/top25_userId?userId=${userId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data as Movie[];
    } else {
      console.error('Error fetching favorites: ', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching favorites: ', error);
    return [];
  }
};