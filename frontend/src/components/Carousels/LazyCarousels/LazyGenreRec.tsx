// components/Carousels/LazyGenreRec.tsx
import { useEffect, useRef, useState } from 'react';
import GenreRec from '../GenreRec'; // Adjust path if needed

interface LazyGenreRecProps {
  genre: string;
}

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" />
    <style>
      {`
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #57c8f4;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
    </style>
  </div>
);


const LazyGenreRec: React.FC<LazyGenreRecProps> = ({ genre }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only observe once
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: '300px' }}>
      {isVisible ? (
        <GenreRec genre={genre} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default LazyGenreRec;
