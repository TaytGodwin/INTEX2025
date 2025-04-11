import React, { useEffect, useState } from 'react';
import { Movie } from '../../types/Movie';
import GetTopRec from '../Carousels/GetTopRec';
import StarRating from './starRating';
import { getUserId } from '../../api/MoviesAPI';
import { pingAuth } from '../../api/IdentityAPI';

// import GenreRec from '../Carousels/GenreRec';
// import LazyGenreRec from '../Carousels/LazyCarousels/LazyGenreRec';

import { Genre } from '../../types/Genre';


interface MovieDetailsProps {
  movie: Movie;
  posterUrl: string;
  onClose: () => void;
  isTopModal?: boolean;
}
const pillStyle: React.CSSProperties = {
  backgroundColor: '#333',
  borderRadius: '20px',
  padding: '0.4rem 0.75rem',
  fontSize: '0.8rem',
  color: '#ccc',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};



const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, posterUrl, onClose, isTopModal}) => {
const [user_id, setUserId] = useState<number | null>(null);
const [genres, setGenres] = useState<Genre[]>([]);
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

// Use pingAuth to get the user's email and then fetch the user id via getUserId
useEffect(() => {
  const fetchUserEmailAndId = async () => {
    const authData = await pingAuth();
    if (authData?.email) {
      const id = await getUserId(authData.email);
      setUserId(id);
    }
  };

  fetchUserEmailAndId();
}, []);
useEffect(() => {
    const fetchGenres = async () => {
      const allGenres = genres;
      setGenres(allGenres);
      console.log(allGenres);
    };
    fetchGenres();
  }, []);
  
  return (
<div style={{ 
  display: 'flex', 
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  gap: '2rem',
  alignItems: 'flex-start' 
}}>
  <div
  className="modal-backdrop"
  onClick={handleBackdropClick}
  style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: isTopModal ? 'rgba(0,0,0,0.7)' : 'transparent',
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
      maxWidth: '900px',
      width: '100%',
      color: '#fff',
      position: 'relative',
      maxHeight: '90vh',
      overflowY: 'auto',
    }}
    onClick={(e) => e.stopPropagation()}
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
    />

    {/* Poster + Info */}
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Poster */}
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

      {/* Info */}
      <div style={{ flex: 1, color: '#e0e0e0' }}>
        <h2 style={{ marginBottom: '1rem', color: '#fff', fontSize: '2rem' }}>{movie.title}</h2>

        {/* ⭐ Star Rating - neatly tucked under the title */}
          {user_id !== null && (
            <div style={{ marginBottom: '1rem' }}>
              <StarRating userId={user_id} showId={movie.show_id} />
            </div>
          )}
        {/* Metadata Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <span style={pillStyle}>{movie.release_year}</span>
          <span style={pillStyle}>HD</span>
          <span style={pillStyle}>{movie.rating}</span>
        </div>

        <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
          {movie.description}
        </p>

        <p><strong style={{ color: '#aaa' }}>Cast:</strong> {movie.cast}, <em>More</em></p>
        <p><strong style={{ color: '#aaa' }}>Country:</strong> {movie.country}</p>
      </div>
    </div>
    {/* Carousel for Recommendations */}
    <div style={{ minHeight: '300px', marginTop: '2rem' }}>
      <GetTopRec showId={movie.show_id} />
      {/* <LazyGenreRec genre={movie.genres[0].genreName || ''}/> */}
    </div>
  </div>
</div>
  </div> 
  );
};

export default MovieDetails;