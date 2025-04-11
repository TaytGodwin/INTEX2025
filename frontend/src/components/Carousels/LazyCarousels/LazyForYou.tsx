import { useEffect, useRef, useState } from 'react';
import ForYou from '../ForYou';
//This is a spinner for displaying UI when movies haven't loaded yet
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

// General function that take user id to then call the appropriate API for movie recommendations just for them
const LazyForYou = ({ userId }: { userId: number }) => {
  const [showComponent, setShowComponent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // This dynamcially loads more movies as the user scrolles (10% threshold of visability)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowComponent(true);
          observer.disconnect(); // Only load once
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Renders the compenent or spinner
  return (
    <div ref={ref} style={{ minHeight: '300px' }}>
      {showComponent ? (
        <div>
          <ForYou userId={userId} />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default LazyForYou;
