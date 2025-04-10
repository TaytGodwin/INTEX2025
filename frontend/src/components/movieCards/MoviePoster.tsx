import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../css/theme.css'; // Make sure your CSS exists

interface MoviePosterProps {
  imageUrl: string;
  title: string;
  onClick?: () => void;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ imageUrl, title, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="movie-poster"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="poster-image-container">
        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          style={{
            display: imageLoaded ? 'block' : 'none',
            width: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
            
          }}
        />
        {/* Skeleton Placeholder */}
        {!imageLoaded && <Skeleton height={225} width={'100%'} borderRadius={8} />}
      </div>

      {/* Title */}
      <div className="movie-poster-title" style={{ marginTop: '0.5rem' }}>
        {imageLoaded ? title : <Skeleton width={100} />}
      </div>
    </div>
  );
};

export default MoviePoster;