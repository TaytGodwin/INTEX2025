import React, { useState, useEffect, useRef, useCallback } from 'react';
import MoviePoster from '../components/movieCards/MoviePoster';
import { getGenres, searchMovies } from '../api/MoviesAPI';
import { getImage } from '../api/ImageAPI';
import { Movie } from '../types/Movie';


function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.!]/g, '');
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});


  // Genre dropdown state
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Reset the movie list and pagination when the search term changes.
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, selectedGenres]);
  // Gets Genres
  useEffect(() => {
    const fetchGenres = async () => {
      const fetchedGenres = await getGenres();
      setGenres(fetchedGenres);
    };
    fetchGenres();
  }, []);

  // Fetch movies whenever the search term or page changes.
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Pass selectedGenre as an array if one is chosen, otherwise an empty array.
        const genreList = selectedGenres.length > 0 ? selectedGenres : [];
        const newMovies = await searchMovies(searchTerm, 25, page, genreList);
        setMovies(prev => (page === 1 ? newMovies : [...prev, ...newMovies]));
        setHasMore(newMovies.length > 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchTerm, selectedGenres, page]);

  // Infinite scrolling: attach an observer to the last movie element.
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );


// Fetch images for the movies when the movies array changes.
   useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = movies.map(async (movie) => {
        const sanitizedTitle = sanitizeTitle(movie.title);
        const encodedTitle = encodeURIComponent(sanitizedTitle);
        try {
          const blob = await getImage(encodedTitle);
          if (blob) {
            return { key: movie.title, url: URL.createObjectURL(blob) };
          } else {
            return { key: movie.title, url: '/images/default.jpg' };
          }
        } catch (error) {
          console.error(`Error fetching image for ${movie.title}:`, error);
          return { key: movie.title, url: '/images/default.jpg' };
        }
      });
      const images = await Promise.all(imagePromises);
      const imageMap: { [key: string]: string } = {};
      images.forEach((img) => {
        imageMap[img.key] = img.url;
      });
      setMovieImages(imageMap);
    };

    if (movies.length > 0) {
      fetchImages();
    }
  }, [movies]);

  return (
    <div className="search-page" style={{ padding: '2rem', minHeight: '100vh', background: 'radial-gradient(ellipse at center, rgba(87,200,244,0.1) 0%, rgba(21,21,21,0.99) 60%)'}}>
      {/* Search Bar */}
      <div
              className="form-group mb-3"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40vh',
                gap: '1.5rem',
                textAlign: 'center',
              }}
            >
              {/* 🔍 Styled Search Bar */}
              <input
                type="text"
                className="form-control"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#303030',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  marginBottom: '1rem',

                }}
              />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
  {genres.map((genre) => {
    const isSelected = selectedGenres.includes(genre);

    return (
      <button
        key={genre}
        type="button"
        onClick={() => {
          if (isSelected) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
          } else {
            setSelectedGenres([...selectedGenres, genre]);
          }
        }}
        style={{
          padding: '0.4rem 0.75rem',
          borderRadius: '20px',
          border: isSelected ? '2px solid #57c8f4' : '1px solid #ccc',
          backgroundColor: isSelected ? '#57c8f4' : 'transparent',
          color: isSelected ? '#fff' : '#fff',
          cursor: 'pointer',
          fontSize: '0.9rem',
          letterSpacing: '0.3px',
          lineHeight: '1.2',
          fontFamily: 'poppins',
          margin: '0.25rem',
          transition: 'all 0.3s ease',
        }}
      >
        {genre}
      </button>
    );
  })}
</div>
      <div style={{ marginTop: '1rem' }}>
        {selectedGenres.length > 0 && (
          <p>Filtering by: {selectedGenres.join(', ')}</p>
        )}
      </div>
      </div>

      {/* Movies Grid */}
      <div
          className="search-results-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '3rem'
          }}
        >
          {movies.map((movie, index) => {
            
            if (movies.length === index + 1) {
              return (
                <div key={movie.title} ref={lastMovieElementRef} style={{ padding: '0 10px' }}>
                  <MoviePoster
                    title={movie.title}
                    imageUrl={movieImages[movie.title] || '/images/default.jpg'}
                  />
                </div>
              );
            } else {
              return (
                <div key={movie.title} style={{ padding: '0 10px' }}>
                  <MoviePoster
                    title={movie.title}
                    imageUrl={movieImages[movie.title] || '/images/default.jpg'}
                  />
                </div>
              );
            }
          })}
        </div>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default SearchPage;