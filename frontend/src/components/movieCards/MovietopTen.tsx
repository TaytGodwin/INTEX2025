// MovietopTen.tsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

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
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        position: 'relative',
        paddingLeft: '5rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
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
