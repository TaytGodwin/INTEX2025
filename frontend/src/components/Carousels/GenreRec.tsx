// GenreRec.tsx

import { useState, useEffect } from 'react';
import { getGenreMovies } from '../../api/RecommenderAPI';  // Import the mock API call
import MoviePoster from '../movieCards/MoviePoster';  // Assuming you have a MoviePoster component for displaying images
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GenreRec = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch movie data from mock API
        const movieData = await getGenreMovies();
        setMovies(movieData);  // Store the fetched movies in state
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();  // Call the function when the component mounts
  }, []);

  if (loading) return <div>Loading movies...</div>;  // Show loading text until the data is fetched

  return (
    <div className="genre-rec">
      <h2>Recommended Movies in Your Genre</h2>
      <div className="carousel">
        {movies.map((movie) => (
          <MoviePoster
            key={movie.show_id}
            imageUrl={`/images/${movie.title.toLowerCase().replace(/ /g, '-')}.jpg`}  // Example image URL logic
            title={movie.title}
            description={movie.description}
            director={movie.director}
            cast={movie.cast}  // Pass the cast array directly
            releaseYear={movie.release_year}
            rating={movie.rating}
            duration={movie.duration}
          />
        ))}
      </div>
    </div>
  );
};

export default GenreRec;
