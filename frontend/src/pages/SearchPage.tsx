import React, { useState, useEffect } from 'react';
import MoviePoster from '../components/movieCards/MoviePoster';
import { getAllMovies } from '../api/AllMoviesAPI'; 
import { Movie } from '../types/Movie';
import '../css/theme.css';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getAllMovies();
      setAllMovies(data);
      setFilteredMovies(data);
    };

    fetchMovies();
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
            <MoviePoster key={movie.show_id} title={movie.title} imageUrl={movie.imageUrl} />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
