import React, { useState, useEffect, useRef } from 'react';
import { getImage } from '../../api/ImageAPI';
import { Movie } from '../../types/Movie';
import GetTopRec from '../Carousels/GetTopRec';

interface MovieDetailsProps {
  movie: Movie;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie}) => {
  const [movieImage, setMovieImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement | null>(null);  // Ref for modal

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

  // Close the modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();  // Close modal if click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movie);

  const closeModal = () => {
    setSelectedMovie(null); // Close the modal
  };

  if (loadingImage) return <div>Loading image...</div>; // Show loading text until the image is fetched

  return (
    <div className="movie-detail-overlay">
      <div className="movie-detail-card" ref={modalRef}>
        {/* Poster & Action Buttons */}
        <div className="header-section">
          {selectedMovie && (
            <>
              <img
                className="banner-poster"
                src={movieImage || '/images/default.jpg'} // Use fetched image URL or default
                alt={`${selectedMovie.title} Poster`}
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}  // Ensure image fits inside modal
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
          {selectedMovie && (
            <>
              <div className="tags">
                <span>{selectedMovie.release_year}</span>
                <span className="tag">{selectedMovie.rating}</span>
              </div>
              <div className="cast-genres">
                <p>
                  <strong>Cast:</strong> {selectedMovie.cast}
                </p>
                <p>
                  <strong>Genres:</strong>
                  {selectedMovie.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre.genreName} {/* Render the genre's name */}
                      {index < selectedMovie.genres.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </div>
              <p className="description">{selectedMovie.description}</p>
            </>
          )}
        </div>

        {/* Recommendations */}
        <div className="related-section">
          <div className="scrollable-related">
            <GetTopRec showId={selectedMovie?.show_id ?? 0} /> {/* You can pass actual related movies here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
