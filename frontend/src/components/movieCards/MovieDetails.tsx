import React, { useState, useEffect, useRef } from 'react';
import { getImage } from '../../api/ImageAPI';
import { Movie } from '../../types/Movie';
import GetTopRec from '../Carousels/GetTopRec';

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
  const modalRef = useRef<HTMLDivElement | null>(null);  // Ref for modal

  // Fetch movie image when component mounts or movie title changes
  useEffect(() => {
    const fetchMovieImage = async () => {
      try {
        const imageBlob = await getImage(movie.title);

        if (imageBlob) {
          setMovieImage(URL.createObjectURL(imageBlob));
        } else {
          setMovieImage('/images/default.jpg'); // Use default image if fetching fails
        }
      } catch (error) {
        console.error('Error fetching movie image:', error);
        setMovieImage('/images/default.jpg');
      } finally {
        setLoadingImage(false);
      }
    };

    fetchMovieImage();
  }, [movie.title]);

  // Close the modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movie);

  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Prevent scrolling on the background when modal is open
  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = 'hidden';  // Disable scrolling
    } else {
      document.body.style.overflow = '';  // Enable scrolling when modal is closed
    }
  }, [selectedMovie]);

  if (loadingImage) return <div>Loading image...</div>;

  return (
    <div className="movie-detail-overlay">
      <div className="movie-detail-card" ref={modalRef}>
        {/* Poster & Action Buttons */}
        <div className="header-section">
          {selectedMovie && (
            <>
              <img
                className="banner-poster"
                src={movieImage || '/images/default.jpg'}
                alt={`${selectedMovie.title} Poster`}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
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
                      {genre.genreName}
                      {index < selectedMovie.genres.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </div>
              <p className="description">{selectedMovie.description}</p>
            </>
          )}
        </div>

        {/* Recommendations 
        <div className="related-section">
          <div className="scrollable-related">
            <GetTopRec showId={selectedMovie?.show_id ?? 0} />
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default MovieDetails;
