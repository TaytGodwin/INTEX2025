// MovietopTen.tsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../css/theme.css';

export interface MovietopTenProps {
  title: string;
  posterUrl: string;
  onClick?: () => void;
  rank?: number;
}

const MovietopTen: React.FC<MovietopTenProps> = ({
  title,
  posterUrl,
  onClick,
  rank,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div
      className="movie-poster"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      //     display: 'flex',
      //     alignItems: 'center',
      //     marginBottom: '1.5rem',
      //     position: 'relative',
      //     paddingLeft: '5rem',
      //     cursor: onClick ? 'pointer' : 'default',
      //   }}
      //   onClick={onClick}
    >
      {rank && (
        <div
          style={{
            fontSize: '15rem',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.08)',
            position: 'absolute',
            left: rank >= 10 ? '-2rem' : '0',
            zIndex: 0,
          }}
        >
          {rank}
        </div>
      )}
      <div className="poster-image-container">
        <img
          src={posterUrl}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Option 1: Simply stop the skeleton by marking as loaded.
            setImageLoaded(true);
            // Option 2: Set a fallback image if not already the default
            if (e.currentTarget.src !== '/images/default.jpg') {
              e.currentTarget.src = '/images/default.jpg';
            }
          }}
          style={{
            // width: '150px',
            // height: 'auto',
            // marginLeft: '2rem',
            // zIndex: 1,
            // borderRadius: '6px',
            display: imageLoaded ? 'block' : 'none',
            width: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
        {/* Skeleton Placeholder */}
        {!imageLoaded && (
          <Skeleton height={225} width={'100%'} borderRadius={8} />
        )}
      </div>

      {/* Title */}
      <div className="movie-poster-title" style={{ marginTop: '0.5rem' }}>
        {imageLoaded ? title : <Skeleton width={100} />}
      </div>
    </div>
  );
};

export default MovietopTen;
