import React from 'react';
import '../../css/theme.css'; // Update or create a CSS file for styling

interface MoviePosterProps {
  imageUrl: string;
  title: string;
  onClick: () => void; // Callback function to open the modal with movie details
}

const MoviePoster: React.FC<MoviePosterProps> = ({ imageUrl, title, onClick }) => {
  return (
    <div className="movie-poster" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="poster-image-container">
        <img src={imageUrl} alt={title} className="poster-image" />
      </div>
      <div className="movie-poster-title">{title}</div>
    </div>
  );
};

export default MoviePoster;
