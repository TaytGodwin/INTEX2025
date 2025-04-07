// This is a component for the Movie posters for carousels, including minimum details. 

import React from 'react';
import '../../css/Navbar.css';

interface MoviePosterProps {
  imageUrl: string;
  title: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ imageUrl, title }) => {
  return (
    <div className="movie-poster">
      <img src={imageUrl} alt={title} className="movie-poster-image" />
      <div className="movie-poster-title">{title}</div>
    </div>
  );
};

export default MoviePoster;