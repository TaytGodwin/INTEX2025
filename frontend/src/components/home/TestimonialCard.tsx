import React from 'react';
import '../../css/theme.css';

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
    <div className="testimonial-card p-3">
      <blockquote className="quote mb-3">“{quote}”</blockquote>
      <div className="d-flex align-items-center">
        <img
          src={imageUrl}
          alt={name}
          className="testimonial-image rounded-circle me-2"
        />
        <div>
          <h5 className="mb-0">{name}</h5>
          <small className="text-muted">{description}</small>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;