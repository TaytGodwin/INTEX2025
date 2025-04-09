import React, { useState, useEffect } from 'react';
import MoviePoster from '../components/movieCards/MoviePoster';
import { getAllMovies } from '../api/AllMoviesAPI';
import { getImage } from '../api/ImageAPI';
import { Movie } from '../types/Movie';
import '../css/theme.css';

function sanitizeTitle(title: string): string {
  // Remove these characters: -, ?, #, (, )
  return title.replace(/[-?#()]/g, '');
}
function isAscii(str: string): boolean {
  // This regex returns true if all characters are within the ASCII range (0-127)
  return /^[\x00-\x7F]*$/.test(str);
}
const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Default fallback image if fetching fails.
  const defaultImageUrl = '/images/default.jpg';

  // Fetch movies from API.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await getAllMovies();
        // Filter out movies whose title is not all ASCII
        const asciiMovies = moviesData.filter((movie) => isAscii(movie.title));

        setAllMovies(asciiMovies);
        setFilteredMovies(asciiMovies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMoviesWithImages = async () => {
      try {
        const moviesData = await getAllMovies();
        // For each movie, fetch the image using the sanitized title
        const imagePromises = moviesData.map(async (movie) => {
          // Remove any leading '#' and encode the title
          const sanitizedTitle = sanitizeTitle(movie.title);
          const encodedTitle = encodeURIComponent(sanitizedTitle);
          const blob = await getImage(encodedTitle);
          if (blob) {
            return { ...movie, imageUrl: URL.createObjectURL(blob) };
          } else {
            // Use a default image if fetching fails
            return { ...movie, imageUrl: '/images/default.jpg' };
          }
        });
        const moviesWithImages = await Promise.all(imagePromises);
        setAllMovies(moviesWithImages);
        setFilteredMovies(moviesWithImages);
      } catch (error) {
        console.error('Failed to fetch movies with images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesWithImages();
  }, []);

  // Filter movies by searchTerm.
  useEffect(() => {
    const results = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(results);
  }, [searchTerm, allMovies]);

  // Fetch images for all movies once they are loaded.
  useEffect(() => {
    const fetchImages = async () => {
      // Map over all movies to fetch their images.
      const imagePromises = allMovies.map(async (movie) => {
        // Sanitize the title by removing problematic characters.
        const sanitizedTitle = sanitizeTitle(movie.title);
        const encodedTitle = encodeURIComponent(sanitizedTitle);
        const blob = await getImage(encodedTitle);
        if (blob) {
          return { title: movie.title, url: URL.createObjectURL(blob) };
        } else {
          return { title: movie.title, url: defaultImageUrl };
        }
      });
      const images = await Promise.all(imagePromises);
      const imageMap: { [title: string]: string } = {};
      images.forEach((img) => {
        imageMap[img.title] = img.url;
      });
      setMovieImages(imageMap);
    };

    if (allMovies.length > 0) {
      fetchImages();
    }
  }, [allMovies, defaultImageUrl]);

  if (loading) return <div>Loading movies...</div>;

  return (
    <div
      className="search-page"
      style={{ padding: '2rem', minHeight: '100vh' }}
    >
      {/* Search Bar */}
      <div
        className="search-bar-container"
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Movies Grid */}
      <div
        className="search-results-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MoviePoster
              key={movie.show_id}
              title={movie.title}
              imageUrl={movieImages[movie.title] || defaultImageUrl}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
