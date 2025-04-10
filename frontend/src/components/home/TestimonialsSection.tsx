import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  quote: string;
  name: string;
  description: string;
  imageUrl: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: 'I’ve discovered so many new genres and movies I never would have found on my own!',
      name: 'Emily Clarke',
      description: 'Movie Enthusiast',
      imageUrl: '/images/Emily.png',
    },
    {
      quote: 'This app makes movie nights so much easier. The recommendations are spot on!',
      name: 'Mark Johnson',
      description: 'Binge Watcher',
      imageUrl: '/images/Mark.png',
    },
    {
      quote: 'I love how easy it is to get recommendations that match exactly what I’m in the mood for!',
      name: 'Michael Brown',
      description: 'Film Buff',
      imageUrl: '/images/Michael.png',
    },
    {
      quote: 'The personalized suggestions are amazing! I’ve found so many hidden gems.',
      name: 'Maria Hales',
      description: 'Indie Film Fan',
      imageUrl: '/images/Milly.png',
    },
    {
      quote: 'Whether I’m in the mood for a blockbuster or an indie film, this app has the best picks!',
      name: 'Sophia Lee',
      description: 'Streamer',
      imageUrl: '/images/Sophia.png',
    },
    {
      quote: 'This app has changed the way I pick movies. It always knows exactly what I’m in the mood for!',
      name: 'David Wilson',
      description: 'TV Critic',
      imageUrl: '/images/David.png',
    },
  ];

  // Track screen width and set columns
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1600) setColumns(6);       // 6x1
      else if (width >= 1200) setColumns(3);   // 3x2
      else if (width >= 768) setColumns(2);    // 2x3
      else setColumns(1);                      // 1x6
    };

    updateColumns(); // Run on load
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return (
    <section
      style={{
        backgroundColor: '#1C1C1C',
        padding: '60px 30px',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          fontFamily: 'Fredoka One',
        }}
      >
        Why Should You Join?
      </h2>
      <p
        style={{
          fontSize: '1.2rem',
          color: '#ccc',
          marginBottom: '30px',
          fontStyle: 'italic',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Hear Some of Our Testimonials
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1.5rem',
        }}
      >
        {testimonials.map((t, index) => (
          <TestimonialCard
            key={index}
            quote={t.quote}
            name={t.name}
            description={t.description}
            imageUrl={t.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
