// components/utils/LazyImage.tsx
import React, { useRef, useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, style, className }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : '/images/default.jpg'}
      alt={alt}
      className={className}
      style={style}
    />
  );
};

export default LazyImage;