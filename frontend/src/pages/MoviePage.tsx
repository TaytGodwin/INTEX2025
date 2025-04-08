import AuthorizeView from '../components/authentication/AuthorizeView';
import React, { useEffect, useState } from 'react';
import MovieRow from '../components/movieCards/MovieRow';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  // any other properties (director, rating, etc.)
}

function MoviePage() {
  const [topPicks, setTopPicks] = useState<Movie[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);

  useEffect(() => {
    // Fetch or mock data for each category
    // Example: setTopPicks(await fetchTopPicks());
    // For now, let's just mock them:
    const mockMovies: Movie[] = [
      { id: 1, title: 'Movie One', imageUrl: '/images/movie1.jpg' },
      { id: 2, title: 'Movie Two', imageUrl: '/images/movie2.jpg' },
      { id: 3, title: 'Movie Three', imageUrl: '/images/movie3.jpg' },
      // ...
    ];
    setTopPicks(mockMovies);
    setRecentlyAdded(mockMovies);
    setRecommended(mockMovies);
  }, []);

  return (
    <div className="container my-5">
      <h1>Welcome, User Name</h1>
      <MovieRow categoryName="Top Picks" movies={topPicks} />
      <MovieRow categoryName="Recently Added" movies={recentlyAdded} />
      <MovieRow categoryName="Recommended for You" movies={recommended} />
    </div>
  );
}

export default MoviePage;