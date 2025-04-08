import React from 'react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  buttonText: string;
  isHighlighted?: boolean;
  planId: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonText,
  isHighlighted = false,
  planId,
}) => {
  const cardClass = isHighlighted ? 'pricing-card highlighted' : 'pricing-card';

  return (
    <div className={cardClass}>
      <h3>{title}</h3>
      <p className="price">
        <span className="price-amount">${price}</span>
        <span className="price-unit">/mo</span>
      </p>
      <ul className="ul-boxed">
        {features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
      <Link to={`/register?plan=${planId}`} className="btn btn-dark">
        {buttonText}
      </Link>
    </div>
  );
};

export default PricingCard;
