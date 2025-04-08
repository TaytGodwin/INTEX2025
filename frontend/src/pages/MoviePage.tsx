import AuthorizeView from '../components/authentication/AuthorizeView';
import React, { useEffect, useState } from 'react';
import MovieRow from '../components/movieCards/MovieRow';
import TopBar from '../components/layout/TopBar';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

function MoviePage() {
  const [topPicks, setTopPicks] = useState<Movie[]>([]);

  useEffect(() => {
    // Replace with your API call or database fetch later
    const mockMovies: Movie[] = [
      { id: 1, title: 'Movie One', imageUrl: '/images/movie1.jpg' },
      { id: 2, title: 'Movie Two', imageUrl: '/images/movie2.jpg' },
      { id: 3, title: 'Movie Three', imageUrl: '/images/movie3.jpg' },
      { id: 4, title: 'Movie Four', imageUrl: '/images/movie4.jpg' },
      { id: 5, title: 'Movie Five', imageUrl: '/images/movie5.jpg' },
      { id: 6, title: 'Movie Six', imageUrl: '/images/movie6.jpg' },
      { id: 7, title: 'Movie Seven', imageUrl: '/images/movie7.jpg' },
      { id: 8, title: 'Movie Eight', imageUrl: '/images/movie8.jpg' },
      { id: 9, title: 'Movie Nine', imageUrl: '/images/movie9.jpg' },
      { id: 10, title: 'Movie Ten', imageUrl: '/images/movie10.jpg' },
      // More movies as needed...
    ];
    setTopPicks(mockMovies);
  }, []);

  // useEffect(() => {
  //   // Replace with our actual API URL
  //   const API_URL = 'AZURE LINK';
    
  //   const fetchMovies = async () => {
  //     try {
  //       const response = await fetch(API_URL, {
  //         method: 'GET',
  //         // If your API requires credentials (e.g., a session cookie),
  //         // include: credentials: 'include'
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status} ${response.statusText}`);
  //       }
  //       const data = await response.json();
  //       // Assuming your API returns an array of movies
  //       setTopPicks(data);
  //     } catch (err: any) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMovies();
  // }, []);

  return (
    <div className="movie-page">
      <MovieRow />
    </div>
  );
}

export default MoviePage;