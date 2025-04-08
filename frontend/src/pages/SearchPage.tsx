import React, { useState, useEffect } from 'react';
import MoviePoster from '../components/movieCards/MoviePoster';
import '../css/theme.css';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Simulating API call to fetch all movies (replace with real endpoint)
    fetch('/api/movies') // Update this to your actual endpoint
      .then(res => res.json())
      .then((data: Movie[]) => {
        setAllMovies(data);
        setFilteredMovies(data); // optionally empty [] if you want to hide until searched
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);

    const results = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm)
    );
    setFilteredMovies(results);
  };

  return (
    <div className="search-page" style={{ padding: '2rem', minHeight: '100vh' }}>
      <div className="search-bar-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={handleSearch}
          style={{
            padding: '0.75rem 1rem',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '8px',
            fontSize: '1rem',
            border: 'none',
          }}
        />
      </div>

      <div
        className="search-results-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MoviePoster key={movie.id} title={movie.title} imageUrl={movie.imageUrl} />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
