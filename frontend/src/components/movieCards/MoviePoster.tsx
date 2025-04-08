// This is a component for the Movie posters for carousels, including minimum details. 

import React from 'react';
import '../../css/theme.css'; // Update or create a CSS file for styling

interface MoviePosterProps {
  imageUrl: string;
  title: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ imageUrl, title }) => {
  return (
    <div className="movie-poster">
      <div className="poster-image-container">
        <img src={imageUrl} alt={title} className="poster-image" />
      </div>
      <div className="movie-poster-title">{title}</div>
    </div>
  );
};

export default MoviePoster;