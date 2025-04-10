import React, { useEffect } from 'react';
import { Movie } from '../../types/Movie';
import GetTopRec from '../Carousels/GetTopRec';


interface MovieDetailsProps {
  movie: Movie;
  posterUrl: string;
  onClose: () => void;
}
const pillStyle = {
  backgroundColor: '#333',
  borderRadius: '4px',
  padding: '0.25rem 0.6rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#fff',
};



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
        <div
  style={{
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  }}
>
      {/* Poster Section */}
    <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
      <img
        src={posterUrl}
        alt={movie.title}
        style={{
          width: '100%',
          borderRadius: '10px',
          objectFit: 'cover',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      />
    </div>

      {/* Movie Info Section
      <div style={{ flex: '2 1 400px', color: '#eee' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>{movie.title}</h2>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Cast:</strong> {movie.cast}</p>
        <p><strong>Release Year:</strong> {movie.release_year}</p>
        <p><strong>Rating:</strong> {movie.rating}</p>
        <p><strong>Duration:</strong> {movie.duration}</p>
        <p><strong>Country:</strong> {movie.country}</p>
        <p style={{ marginTop: '1rem' }}>{movie.description}</p>
      </div> */}
    </div>

    <div style={{ flex: 1, color: '#e0e0e0' }}>
    {/* Title */}
    <h2 style={{ marginBottom: '1rem', color: '#fff', fontSize: '2rem' }}>{movie.title}</h2>

    {/* Metadata */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
      <span style={pillStyle}>{movie.release_year}</span>
      <span style={pillStyle}>HD</span>
      <span style={pillStyle}>{movie.rating}</span>
    </div>

    {/* Description */}
    <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
      {movie.description}
    </p>

    {/* Cast */}
    <p><strong style={{ color: '#aaa' }}>Cast:</strong> {movie.cast}, <em>More</em></p>

    {/* Genre */}
    <p><strong style={{ color: '#aaa' }}>Genres:</strong> {movie.genres.join(',').slice(0, 3)}</p>

    {/* Tags */}
    <p><strong style={{ color: '#aaa' }}>Country:</strong> {movie.country}</p> {/* Optional extra */}
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
