// MovietopTen.tsx
import React from 'react';

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
      <img
        src={posterUrl}
        alt={title}
        style={{
          width: '150px',
          height: 'auto',
          marginLeft: '2rem',
          zIndex: 1,
          borderRadius: '6px',
        }}
      />
    </div>
  );
};

export default MovietopTen;
