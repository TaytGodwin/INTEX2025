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
const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Default fallback image if fetching fails.
  const defaultImageUrl = '/images/default.jpg';

  // Fetch movies from API.
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setAllMovies(data);
        setFilteredMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies by searchTerm.
  useEffect(() => {
    const results = allMovies.filter(movie =>
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
          filteredMovies.map(movie => (
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

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import MoviePoster from '../components/movieCards/MoviePoster';
// import { getAllMovies } from '../api/AllMoviesAPI';
// import { getImage } from '../api/ImageAPI';
// import { Movie } from '../types/Movie';
// import '../css/theme.css';

// function sanitizeTitle(title: string): string {
//   // Remove these characters: -, ?, #, (, )
//   return title.replace(/[-?#()]/g, '');
// }

// const SearchPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [allMovies, setAllMovies] = useState<Movie[]>([]);
//   const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
//   const [movieImages, setMovieImages] = useState<{ [title: string]: string }>({});
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(1);

//   const observer = useRef<IntersectionObserver | null>(null);
//   const lastMovieElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver(entries => {
//         if (entries[0].isIntersecting && hasMore) {
//           // Load next page when the last element is visible
//           setPage(prevPage => prevPage + 1);
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   // Default fallback image if fetching fails.
//   const defaultImageUrl = '/images/default.jpg';

//   // Fetch movies from API with pagination.
//   useEffect(() => {
//     const fetchMovies = async () => {
//       setLoading(true);
//       const newMovies = await getAllMovies(page, 25); // load 25 movies per page
//       setAllMovies(prevMovies => [...prevMovies, ...newMovies]);
//       setHasMore(newMovies.length > 0);
//       setLoading(false);
//     };

//     fetchMovies();
//   }, [page]);

//   // Filter movies by searchTerm.
//   useEffect(() => {
//     const results = allMovies.filter(movie =>
//       movie.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredMovies(results);
//   }, [searchTerm, allMovies]);

//   // Fetch images for all movies once they are loaded.
//   useEffect(() => {
//     const fetchImages = async () => {
//       const imagePromises = allMovies.map(async (movie) => {
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
//         className="movies-grid"
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
//           gap: '1.5rem',
//         }}
//       >
//         {filteredMovies.length > 0 ? (
//           filteredMovies.map((movie, index) => {
//             if (filteredMovies.length === index + 1) {
//               // Attach the ref to the last movie element in filteredMovies.
//               return (
//                 <div key={movie.show_id} ref={lastMovieElementRef} style={{ padding: '0 5px' }}>
//                   <MoviePoster
//                     title={movie.title}
//                     imageUrl={movieImages[movie.title] || defaultImageUrl}
//                   />
//                 </div>
//               );
//             } else {
//               return (
//                 <div key={movie.show_id} style={{ padding: '0 5px' }}>
//                   <MoviePoster
//                     title={movie.title}
//                     imageUrl={movieImages[movie.title] || defaultImageUrl}
//                   />
//                 </div>
//               );
//             }
//           })
//         ) : (
//           <p style={{ textAlign: 'center' }}>No movies found.</p>
//         )}
//       </div>
//       {loading && <div>Loading more movies...</div>}
//     </div>
//   );
// };

// export default SearchPage;