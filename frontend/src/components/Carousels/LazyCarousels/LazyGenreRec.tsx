// components/Carousels/LazyGenreRec.tsx
import { useEffect, useRef, useState } from 'react';
import GenreRec from '../GenreRec'; // Adjust path if needed

interface LazyGenreRecProps {
  genre: string;
}

const LazyGenreRec: React.FC<LazyGenreRecProps> = ({ genre }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
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
      {isVisible ? <GenreRec genre={genre} /> : <div style={{ height: '350px' }} />}
    </div>
  );
};

export default LazyGenreRec;