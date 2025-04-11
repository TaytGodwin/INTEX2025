import React, { useState, useEffect, useRef, useCallback } from 'react';

import MovieDetails from '../components/movieCards/MovieDetails';
import { getGenres, searchMovies } from '../api/MoviesAPI';
import { getImage } from '../api/ImageAPI';
import { Movie } from '../types/Movie';
import { Genre } from '../types/Genre';
import LazyImage from '../components/movieCards/LazyImage';


const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" />
    <style>
      {`
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #57C8F4;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
    </style>
  </div>
);

function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.!&]/g, '');
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPosterUrl, setSelectedPosterUrl] = useState<string>('');
      
  // Spinner effect
    useEffect(() => {
      if (loading) {
        const timeout = setTimeout(() => setShowSpinner(true), 300);
        return () => clearTimeout(timeout);
      } else {
        setShowSpinner(false);
      }
    }, [loading]);


  // Genre dropdown state
  const [genres, setGenres] = useState<Genre[]>([]);
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
      console.log('Fetched genres:', fetchedGenres)
      setGenres(fetchedGenres);
    };
    fetchGenres();
  }, []);

  // Fetch movies whenever the search term or page changes.
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        //gives impression things are loading in
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Pass selectedGenre as an array if one is chosen, otherwise an empty array.
        const genreList = selectedGenres.length > 0 ? selectedGenres : [];
        const newMovies = await searchMovies(searchTerm || '', 25, page, genreList);

        
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
                  width: '50%',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#404040', // slightly lighter than #303030
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  transition: 'box-shadow 0.3s ease',
                }}
              />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
  {genres.map((genre) => {
    const isSelected = selectedGenres.includes(genre.genreName);

    return (
      <button
        key={genre.genreID}
        type="button"
        onClick={() => {
          if (isSelected) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre.genreName));
          } else {
            setSelectedGenres([...selectedGenres, genre.genreName]);
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
        {genre.genreName}
      </button>
    );
  })}
</div>
</div>
      {searchTerm === '' && selectedGenres.length === 0 && (
        <h3 style={{ color: '#fff' , padding: '1rem' }}>Showing all movies...</h3>
      )}

      {searchTerm === '' && selectedGenres.length > 0 && (
        <h3 style={{ color: '#fff', padding: '1rem'  }}>Showing all movies in genre(s): {selectedGenres.join(', ')}</h3>
      )}

      {searchTerm !== '' && (
        <h3 style={{ color: '#fff' , padding: '1rem' }}>
          Searching for: "<strong>{searchTerm}</strong>"{selectedGenres.length > 0 ? ` in genre(s): ${selectedGenres.join(', ')}` : ''}
        </h3>
      )}
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
                <div
                    key={movie.title}
                    style={{ padding: '0 10px', cursor: 'pointer' }}
                    ref={index === movies.length - 1 ? lastMovieElementRef : undefined}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setSelectedPosterUrl(movieImages[movie.title] || '/images/default.jpg');
                    }}
                  >
                    <LazyImage
                      src={movieImages[movie.title] || '/images/default.jpg'}
                      alt={movie.title}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    {/* <MoviePoster
                      key={movie.show_id}
                      imageUrl={movieImages[movie.title] || '/images/default.jpg'}
                      title={movie.title}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setSelectedPosterUrl(
                          movieImages[movie.title] || '/images/default.jpg'
                        );
                      }} // Handle the click to open the modal
                    /> */}
                    <h5 style={{ color: '#fff', textAlign: 'center', marginTop: '0.5rem' }}>
                      {movie.title}
                    </h5>
                  </div>
              );
            } else {
              return (
                <div
                  key={movie.title}
                  style={{ padding: '0 10px', cursor: 'pointer' }}
                  ref={index === movies.length - 1 ? lastMovieElementRef : undefined}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setSelectedPosterUrl(movieImages[movie.title] || '/images/default.jpg');
                  }}
                >
                  <LazyImage
                    src={movieImages[movie.title] || '/images/default.jpg'}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <h5 style={{ color: '#fff', textAlign: 'center', marginTop: '0.5rem' }}>
                    {movie.title}
                  </h5>
                </div>
              );
            }
          })}
        </div>
        {showSpinner && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '2rem 0',
              opacity: 0.8,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <Spinner />
          </div>
          )}  
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            posterUrl={selectedPosterUrl}
            onClose={() => {
              setSelectedMovie(null);
              setSelectedPosterUrl('');
            }}
          />
        )}
    </div>
  );
};

export default SearchPage;