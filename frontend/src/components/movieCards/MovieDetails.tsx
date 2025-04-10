import React, { useEffect } from 'react';
import { Movie } from '../../types/Movie';
import GetTopRec from '../Carousels/GetTopRec';


interface MovieDetailsProps {
  movie: Movie;
  posterUrl: string;
  onClose: () => void;
}



const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, posterUrl, onClose }) => {
  
  useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);
  
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as Element).classList.contains('modal-backdrop')) {
        onClose();
      }
    };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie]);
  
  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '2rem',
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: '#181818',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '800px',
          width: '100%',
          color: '#fff',
          position: 'relative',
          maxHeight: '90vh',           // 👈 prevents content from growing endlessly
          overflowY: 'auto',  
        }}
        onClick={(e) => e.stopPropagation()} // Don't close modal when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="bi bi-arrow-left"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            fontSize: '2rem',
            color: '#fff',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#57c8f4';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
        ></button>

        {/* Poster + Info Layout */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <img
            src={posterUrl}
            alt={movie.title}
            style={{
              width: '200px',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <div>
            <h2 style={{ marginBottom: '1rem' }}>{movie.title}</h2>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Cast:</strong> {movie.cast}</p>
            <p><strong>Release Year:</strong> {movie.release_year}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <p><strong>Duration:</strong> {movie.duration}</p>
            <p><strong>Country:</strong> {movie.country}</p>
            <p style={{ marginTop: '1rem' }}>{movie.description}</p>
          </div>
        </div>

        {/* Carousel for Recommendations */}
        <div style={{ marginTop: '3rem', paddingBottom: '2rem'  }}>
          <GetTopRec showId={movie.show_id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
