import { useEffect, useState } from 'react';
import { getMovieDetails, getRelatedMovies } from '../../api/MoviesAPI'; // Your API calls for fetching movie data and related movies


interface Movie {
  title: string;
  year: string;
  rating: string;
  director: string;
  cast: string;
  genres: string;
  description: string;
  imageUrl: string;
}

interface RelatedMovie {
  title: string;
  imageUrl: string;
}

function MovieDetails({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieData = await getMovieDetails(movieId); // Fetch movie details by movieId
        setMovie(movieData);

        const relatedMoviesData = await getRelatedMovies(movieId); // Fetch related movies
        setRelatedMovies(relatedMoviesData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-card">
          {/* Poster & Action Buttons */}
          <div className="header-section">
            {movie && (
              <>
                <img
                  className="banner-poster"
                  src={movie.imageUrl || '/images/default.jpg'}
                  alt={`${movie.title} Poster`}
                />
                <div className="action-buttons">
                  <button className="play-button">▶</button>
                  <button className="add-button">＋</button>
                  <button className="favorite-button">☆</button>
                </div>
              </>
            )}
          </div>

          {/* Metadata */}
          <div className="movie-info">
            {movie && (
              <>
                <div className="tags">
                  <span>{movie.year}</span>
                  <span className="tag">{movie.rating}</span>
                </div>
                <div className="cast-genres">
                  <p>
                    <strong>Cast:</strong> {movie.cast}
                  </p>
                  <p>
                    <strong>Genres:</strong> {movie.genres}
                  </p>
                </div>
                <p className="description">{movie.description}</p>
              </>
            )}
          </div>

          {/* Recommendations */}
          <div className="related-section">
            <h3>If you’ll like this, you’d definitely love…</h3>
            <div className="scrollable-related">
              {relatedMovies.map((movie, index) => (
                <div className="related-card" key={index}>
                  <img src={movie.imageUrl} alt={movie.title} />
                  <div className="related-title">{movie.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default MovieDetails;
