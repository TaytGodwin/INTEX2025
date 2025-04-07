import React from 'react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  quote: string;
  name: string;
  description: string;
  imageUrl: string;
}

const TestimonialsSection: React.FC = () => {
  // In a real app, this data might come from an API or database
  const testimonials: Testimonial[] = [
    {
      quote: 'This platform changed my life!',
      name: 'Jane Doe',
      description: 'Movie Enthusiast',
      imageUrl: 'https://example.com/jane.jpg',
    },
    {
      quote: 'I found all my favorite shows here!',
      name: 'John Smith',
      description: 'Binge Watcher',
      imageUrl: 'https://example.com/john.jpg',
    },
    {
      quote: 'Incredible selection and user-friendly design.',
      name: 'Emily Johnson',
      description: 'TV Critic',
      imageUrl: 'https://example.com/emily.jpg',
    },
    {
      quote: 'A must-have subscription for any movie lover.',
      name: 'Michael Brown',
      description: 'Film Buff',
      imageUrl: 'https://example.com/michael.jpg',
    },
    {
      quote: 'Seamless streaming experience every time!',
      name: 'Sophia Lee',
      description: 'Streamer',
      imageUrl: 'https://example.com/sophia.jpg',
    },
    {
      quote: 'Great original content. Highly recommended!',
      name: 'David Wilson',
      description: 'Indie Film Fan',
      imageUrl: 'https://example.com/david.jpg',
    },
  ];

  return (
    <section className="container my-5">
      <h2 className="mb-1">Why should you join?</h2>
      <p className="text-muted mb-4">Hear some of our testimonials</p>
      <div className="row g-3">
        {testimonials.map((t, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <TestimonialCard
              quote={t.quote}
              name={t.name}
              description={t.description}
              imageUrl={t.imageUrl}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;