import React, { useState, useEffect } from 'react';
import { getImage } from '../../api/ImageAPI';
import { Movie } from '../../types/Movie';

interface RelatedMovie {
  title: string;
  imageUrl: string;
}

interface MovieDetailsProps {
  movie: Movie; 
  relatedMovies: RelatedMovie[];
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, relatedMovies }) => {
  const [movieImage, setMovieImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieImage = async () => {
      try {
        // Fetch the movie image based on its title
        const imageBlob = await getImage(movie.title);

        // If an image is returned, convert it into an object URL
        if (imageBlob) {
          setMovieImage(URL.createObjectURL(imageBlob));
        } else {
          setMovieImage('/images/default.jpg'); // Use default image if fetching fails
        }
      } catch (error) {
        console.error('Error fetching movie image:', error);
        setMovieImage('/images/default.jpg'); // Use default image in case of an error
      } finally {
        setLoadingImage(false); // Set loading to false after the image fetch is complete or failed
      }
    };

    fetchMovieImage(); // Call the function when the component mounts
  }, [movie.title]); // Re-fetch if the movie title changes

  if (loadingImage) return <div>Loading image...</div>; // Show loading text until the image is fetched

  return (
    <div className="movie-detail-overlay">
      <div className="movie-detail-card">
        {/* Poster & Action Buttons */}
        <div className="header-section">
          {movie && (
            <>
              <img
                className="banner-poster"
                src={movieImage || '/images/default.jpg'} // Use fetched image URL or default
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
                <span>{movie.release_year}</span>
                <span className="tag">{movie.rating}</span>
              </div>
              <div className="cast-genres">
                <p>
                  <strong>Cast:</strong> {movie.cast}
                </p>
                <p>
                  <strong>Genres:</strong> 
                  {movie.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre.genreName} {/* Render the genre's name */}
                      {index < movie.genres.length - 1 && ', '}
                    </span>
                  ))}
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
            {relatedMovies.map((relatedMovie, index) => (
              <div className="related-card" key={index}>
                <img src={relatedMovie.imageUrl} alt={relatedMovie.title} />
                <div className="related-title">{relatedMovie.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
