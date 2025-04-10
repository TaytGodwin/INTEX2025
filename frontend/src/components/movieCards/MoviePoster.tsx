import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import '../../css/theme.css';
interface MoviePosterProps {
  imageUrl: string;
  title: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
const MoviePoster: React.FC<MoviePosterProps> = ({ imageUrl, title, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <motion.div
      className="movie-poster"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <div className="poster-image-container">
        {/* Actual Image */}
        <img
          src={imageUrl}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          style={{
            display: imageLoaded ? 'block' : 'none',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            objectFit: 'cover',
          }}
        />
        {/* Skeleton Placeholder */}
        {!imageLoaded && <Skeleton height={225} width={'100%'} borderRadius={12} />}
      </div>
      {/* Title Below Poster */}
      <div
        className="movie-poster-title"
        style={{
          marginTop: '0.5rem',
          color: '#fff',
          fontWeight: 500,
          fontSize: '0.9rem',
        }}
      >
        {imageLoaded ? title : <Skeleton width={100} />}
      </div>
    </motion.div>
  );
};
export default MoviePoster;

