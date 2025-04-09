// import React, { useState, useEffect } from 'react';
// import MoviePoster from '../components/movieCards/MoviePoster';
// import { getAllMovies, getTotalMovies } from '../api/MoviesAPI';
// import { getImage } from '../api/ImageAPI';
// import { Movie } from '../types/Movie';
// import '../css/theme.css';

// function sanitizeTitle(title: string): string {
//   // Remove these characters: -, ?, #, (, )
//   return title.replace(/[-?#()]/g, '');
// }
// function isAscii(str: string): boolean {
//   // This regex returns true if all characters are within the ASCII range (0-127)
//   return /^[\x00-\x7F]*$/.test(str);
// }
// const SearchPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [allMovies, setAllMovies] = useState<Movie[]>([]);
//   const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
//   const [movieImages, setMovieImages] = useState<{ [title: string]: string }>(
//     {}
//   );
//   const [loading, setLoading] = useState<boolean>(true);

//   // Default fallback image if fetching fails.
//   const defaultImageUrl = '/images/default.jpg';

//   // Fetch movies from API.
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const moviesData = await getAllMovies();
//         // Filter out movies whose title is not all ASCII
//         const asciiMovies = moviesData.filter((movie) => isAscii(movie.title));

//         setAllMovies(asciiMovies);
//         setFilteredMovies(asciiMovies);
//       } catch (error) {
//         console.error('Failed to fetch movies:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchMoviesWithImages = async () => {
//       try {
//         const moviesData = await getTotalMovies();
//         // For each movie, fetch the image using the sanitized title
//         const imagePromises = moviesData.map(async (movie) => {
//           // Remove any leading '#' and encode the title
//           const sanitizedTitle = sanitizeTitle(movie.title);
//           const encodedTitle = encodeURIComponent(sanitizedTitle);
//           const blob = await getImage(encodedTitle);
//           if (blob) {
//             return { ...movie, imageUrl: URL.createObjectURL(blob) };
//           } else {
//             // Use a default image if fetching fails
//             return { ...movie, imageUrl: '/default.jpg' };
//           }
//         });
//         const moviesWithImages = await Promise.all(imagePromises);
//         setAllMovies(moviesWithImages);
//         setFilteredMovies(moviesWithImages);
//       } catch (error) {
//         console.error('Failed to fetch movies with images:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMoviesWithImages();
//   }, []);

//   // Filter movies by searchTerm.
//   useEffect(() => {
//     const results = allMovies.filter((movie) =>
//       movie.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredMovies(results);
//   }, [searchTerm, allMovies]);

//   // Fetch images for all movies once they are loaded.
//   useEffect(() => {
//     const fetchImages = async () => {
//       // Map over all movies to fetch their images.
//       const imagePromises = allMovies.map(async (movie) => {
//         // Sanitize the title by removing problematic characters.
//         const sanitizedTitle = sanitizeTitle(movie.title);
//         const encodedTitle = encodeURIComponent(sanitizedTitle);
//         const blob = await getImage(encodedTitle);
//         if (blob) {
//           return { title: movie.title, url: URL.createObjectURL(blob) };
//         } else {
//           return { title: movie.title, url: defaultImageUrl };
//         }
//       });
//       const images = await Promise.all(imagePromises);
//       const imageMap: { [title: string]: string } = {};
//       images.forEach((img) => {
//         imageMap[img.title] = img.url;
//       });
//       setMovieImages(imageMap);
//     };

//     if (allMovies.length > 0) {
//       fetchImages();
//     }
//   }, [allMovies, defaultImageUrl]);

//   if (loading) return <div>Loading movies...</div>;

//   return (
//     <div
//       className="search-page"
//       style={{ padding: '2rem', minHeight: '100vh' }}
//     >
//       {/* Search Bar */}
//       <div
//         className="search-bar-container"
//         style={{ textAlign: 'center', marginBottom: '2rem' }}
//       >
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search movies..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: '0.75rem 1rem',
//             width: '100%',
//             maxWidth: '500px',
//             borderRadius: '8px',
//             fontSize: '1rem',
//             border: 'none',
//           }}
//         />
//       </div>

//       {/* Movies Grid */}
//       <div
//         className="search-results-grid"
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
//           gap: '1.5rem',
//         }}
//       >
//         {filteredMovies.length > 0 ? (
//           filteredMovies.map((movie) => (
//             <MoviePoster
//               key={movie.show_id}
//               title={movie.title}
//               imageUrl={movieImages[movie.title] || defaultImageUrl}
//             />
//           ))
//         ) : (
//           <p style={{ textAlign: 'center' }}>No movies found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import MoviePoster from '../components/movieCards/MoviePoster';
// import { getTotalMovies, searchMovies } from '../api/MoviesAPI';
// import { getImage } from '../api/ImageAPI';
// import { Movie } from '../types/Movie';
// import '../css/theme.css';

// // Helper to sanitize a title (removes problematic characters)
// function sanitizeTitle(title: string): string {
//   return title.replace(/[-?#()]/g, '');
// }

// const SearchPage: React.FC = () => {
//   // Search term state (for client-side filtering)
//   const [searchTerm, setSearchTerm] = useState('');
//   // Movies loaded from API
//   const [movies, setMovies] = useState<Movie[]>([]);
//   // State for infinite scrolling
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);
//   // Mapping of movie titles to their fetched image URLs
//   const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});

//   // Reset movies and pagination when search term changes
//   useEffect(() => {
//     setMovies([]);
//     setPage(1);
//     setHasMore(true);
//   }, [searchTerm]);

//   // Fetch movies whenever the search term or page changes.
//   useEffect(() => {
//     const fetchMovies = async () => {
//       setLoading(true);
//       try {
//         // Call the searchMovies API with the current search term, page, and pageSize.
//         const newMovies = await searchMovies(searchTerm, 25, page);
//         // For page 1, replace the list; for later pages, append to it.
//         setMovies(prev => (page === 1 ? newMovies : [...prev, ...newMovies]));
//         setHasMore(newMovies.length > 0);
//       } catch (error) {
//         console.error('Error fetching search results:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMovies();
//   }, [searchTerm, page]);

//   // Set up infinite scrolling with an IntersectionObserver
//   const observer = useRef<IntersectionObserver | null>(null);
//   const lastMovieElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   // Fetch images for movies whenever the movies array changes
//   useEffect(() => {
//     const fetchImages = async () => {
//       const imagePromises = movies.map(async (movie) => {
//         const sanitizedTitle = sanitizeTitle(movie.title);
//         const encodedTitle = encodeURIComponent(sanitizedTitle);
//         const blob = await getImage(encodedTitle);
//         if (blob) {
//           return { title: movie.title, url: URL.createObjectURL(blob) };
//         } else {
//           return { title: movie.title, url: '/images/default.jpg' };
//         }
//       });
//       const images = await Promise.all(imagePromises);
//       const imageMap: { [title: string]: string } = {};
//       images.forEach((img) => {
//         imageMap[img.title] = img.url;
//       });
//       setMovieImages(imageMap);
//     };

//     if (movies.length > 0) {
//       fetchImages();
//     }
//   }, [movies]);

//   if (loading) 
//     return <div style={{ background: '#fff', minHeight: '100vh', padding: '2rem' }}>Loading...</div>;


//   return (
//     <div className="search-page" style={{ padding: '2rem', minHeight: '100vh' }}>
//       {/* Search Bar */}
//       <div className="search-bar-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search movies..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: '0.75rem 1rem',
//             width: '100%',
//             maxWidth: '500px',
//             borderRadius: '8px',
//             fontSize: '1rem',
//             border: 'none',
//           }}
//         />
//       </div>

//       {/* Movies Grid */}
//       <div
//         className="search-results-grid"
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
//           gap: '1.5rem',
//         }}
//       >
//         {movies.map((movie, index) => {
//           if (movies.length === index + 1) {
//             // Attach the observer to the last element
//             return (
//               <div key={movie.show_id} ref={lastMovieElementRef} style={{ padding: '0 10px' }}>
//                 <MoviePoster
//                   title={movie.title}
//                   imageUrl={movieImages[movie.title] || '/images/default.jpg'}
//                 />
//               </div>
//             );
//           } else {
//             return (
//               <div key={movie.show_id} style={{ padding: '0 10px' }}>
//                 <MoviePoster
//                   title={movie.title}
//                   imageUrl={movieImages[movie.title] || '/images/default.jpg'}
//                 />
//               </div>
//             );
//           }
//         })}
//       </div>
//       {loading && <div>Loading...</div>}
//     </div>
//   );
// };

// export default SearchPage;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import MoviePoster from '../components/movieCards/MoviePoster';
import { searchMovies } from '../api/MoviesAPI';
import { getImage } from '../api/ImageAPI';
import { Movie } from '../types/Movie';
import '../css/theme.css';

function sanitizeTitle(title: string): string {
  return title.replace(/[-?#()'":’‘“”.]/g, '');
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});

  // Reset the movie list and pagination when the search term changes.
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  // Fetch movies whenever the search term or page changes.
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Call the searchMovies API with the current search term, page, and pageSize.
        const newMovies = await searchMovies(searchTerm, 25, page);
        // For page 1, replace the list; for later pages, append to it.
        setMovies(prev => (page === 1 ? newMovies : [...prev, ...newMovies]));
        setHasMore(newMovies.length > 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchTerm, page]);

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
      // Copy current images so we don't overwrite existing ones
      const imageMap = { ...movieImages };
  
      const imagePromises = movies.map(async (movie) => {
        // Use a stable unique key; movie.show_id is preferable if available.
        if (!imageMap[movie.title]) { 
          const sanitizedTitle = sanitizeTitle(movie.title);
          const encodedTitle = encodeURIComponent(sanitizedTitle);
          try {
            const blob = await getImage(encodedTitle);
            if (blob) {
              imageMap[movie.title] = URL.createObjectURL(blob);
            } else {
              imageMap[movie.title] = '/images/default.jpg';
            }
          } catch (error) {
            console.error(`Error fetching image for ${movie.title}:`, error);
            imageMap[movie.title] = '/images/default.jpg';
          }
        }
      });
      await Promise.all(imagePromises);
      setMovieImages(imageMap);
    };
  
    if (movies.length > 0) {
      fetchImages();
    }
  }, [movies]);

  return (
    <div className="search-page" style={{ padding: '2rem', minHeight: '100vh' }}>
      {/* Search Bar */}
      <div className="search-bar-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            border: 'none'
          }}
        />
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
            // Use movie.show_id as the key if it's unique.
            if (movies.length === index + 1) {
              return (
                <div key={movie.show_id} ref={lastMovieElementRef} style={{ padding: '0 10px' }}>
                  <MoviePoster
                    title={movie.title}
                    imageUrl={movieImages[movie.title] || '/images/default.jpg'}
                  />
                </div>
              );
            } else {
              return (
                <div key={movie.show_id} style={{ padding: '0 10px' }}>
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