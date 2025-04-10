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
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h5 style={nameStyle}>{name}</h5>
        <small style={descriptionStyle}>{description}</small>
      </div>
      <div style={bodyStyle}>
        <img
          src={imageUrl}
          alt={name}
          style={imageStyle}
        />
        <p style={quoteStyle}>“{quote}”</p>
      </div>
    </div>
  );
};
// Inline Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: '#333',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  color: '#fff',
  textAlign: 'left',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  // Centers content horizontally
};
const headerStyle: React.CSSProperties = {
  marginBottom: '10px',
  textAlign: 'center',  // Centers the name and description
};
const nameStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  marginBottom: '5px',
};
const descriptionStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#bbb',
};
const bodyStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  justifyContent: 'center',  // Centers the image and quote horizontally
};
const imageStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
};
const quoteStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#ddd',
  fontStyle: 'italic',
  maxWidth: '300px',  // Ensures the quote doesn't get too wide
  textAlign: 'center',  // Centers the quote text
};
export default TestimonialCard;