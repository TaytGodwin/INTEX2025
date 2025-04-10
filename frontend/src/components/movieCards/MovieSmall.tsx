// This is a component for the Movie Cards small Size, including minimum details, rating, adding to list, and all the necessary points of info needed. 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
interface MovieSmallProps {
  posterUrl: string;
  title: string;
  onClick?: () => void;
}
const MovieSmall: React.FC<MovieSmallProps> = ({ posterUrl, title, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <motion.div
      className="movie-small"
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }} // :rocket: Bolder grow
      whileTap={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 10,
        borderRadius: '16px', // :large_green_circle: Sleek corners
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      {/* Poster */}
      <img
        src={posterUrl}
        alt={title}
        onLoad={() => setImageLoaded(true)}
        style={{
          display: imageLoaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out',
        }}
      />
      {/* Title Overlay */}
      {imageLoaded && (
       <div
       style={{
         padding: '0.75rem 1rem',
         color: '#fff',
         textAlign: 'center',
         fontSize: '1rem',
         borderBottomLeftRadius: '16px',
         borderBottomRightRadius: '16px',
         background: '#222', // darker background to contrast image
       }}
     >
       {title}
     </div>
      )}
    </motion.div>
  );
};
export default MovieSmall;