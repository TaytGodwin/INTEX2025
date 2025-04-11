import React from 'react';
import TestimonialCard from './TestimonialCard';
interface Testimonial {
  quote: string;
  name: string;
  description: string;
  imageUrl: string;
}
const TestimonialsSection: React.FC = () => {
  // Array of testimonial data:
  // - Each object includes a quote, user name, description, and image for display in the testimonials section
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
  return (
    // Renders the testimonials section:
    // - Displays a header and description
    // - Maps over testimonial data to render individual TestimonialCard components in a responsive layout
    <section style={sectionStyle}>
      <h2 style={sectionHeaderStyle}>Why should you join?</h2>
      <p style={sectionDescStyle}>Hear some of our testimonials</p>
      <div style={testimonialsRowStyle}>
        {testimonials.map((t, index) => (
          <div key={index} style={testimonialColumnStyle}>
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
// Inline Styles
const sectionStyle: React.CSSProperties = {
  backgroundColor: '#1C1C1C',
  padding: '60px 30px',
  textAlign: 'center',
  color: '#fff',
};
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
};
const sectionDescStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#ccc',
  marginBottom: '30px',
  fontStyle: 'italic',
};
const testimonialsRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
};
const testimonialColumnStyle: React.CSSProperties = {
  flexBasis: '48%',
  marginBottom: '20px',
};
export default React.memo(TestimonialsSection);
