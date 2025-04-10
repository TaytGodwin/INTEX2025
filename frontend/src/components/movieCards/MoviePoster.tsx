import React from 'react';
import '../../css/theme.css'; // Make sure you have styles defined here

interface MoviePosterProps {
  imageUrl: string;
  title: string;
  onClick?: () => void; // Optional, for posters that don't need interaction
}

// This is a different Comment

const MoviePoster: React.FC<MoviePosterProps> = ({ imageUrl, title, onClick }) => {
  return (
    <div className="movie-poster" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="poster-image-container">
        <img src={imageUrl} alt={title} className="poster-image" />
      </div>
      <div className="movie-poster-title">{title}</div>
    </div>
  );
};

export default MoviePoster;