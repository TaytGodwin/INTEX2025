// components/Carousels/LazyGenreRec.tsx
import { useEffect, useRef, useState } from 'react';
import GenreRec from '../GenreRec'; // Adjust path if needed

// Builds the base for how we will pass in genres to get a recommended carosael (sp?)
interface LazyGenreRecProps {
  genre: string;
}

// A loading image, spinner circle for when movies don't load
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

// Manges the view of the genre carselous
const LazyGenreRec: React.FC<LazyGenreRecProps> = ({ genre }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keeps track of how far the use scrolls to dynamcially render more movie information
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

  // Sets up genre view based on a specific genre or displays a loading spinner (one for the entire element)
  return (
    <div ref={containerRef} style={{ minHeight: '300px' }}>
      {isVisible ? <GenreRec genre={genre} /> : <Spinner />}
    </div>
  );
};

export default LazyGenreRec;
