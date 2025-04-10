import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  description: string;
  imageUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  description,
  imageUrl,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '260px',
        justifyContent: 'center',
      }}
    >
      <img
        src={imageUrl}
        alt={name}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '1rem',
        }}
      />
      <p
        style={{
          fontSize: '1.1rem',
          color: '#ddd',
          fontStyle: 'italic',
          maxWidth: '300px',
          marginBottom: '1rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        “{quote}”
      </p>
      <h5
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          margin: 0,
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {name}
      </h5>
      <small
        style={{
          fontSize: '0.95rem',
          color: '#bbb',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {description}
      </small>
    </div>
  );
};

export default TestimonialCard;
