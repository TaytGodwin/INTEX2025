import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PricingCard from './PricingCard';
import { features } from 'process';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleToggle = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };

  const pricingData = [
    {
      planId: 'basic',
      title:'Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Access to limited catalog',
        'SD streaming quality',
        '1 device at a time',
      ],
      buttonText: 'Try Free',
    },
    {
      planId: 'standard',
      title:'Standard',
      monthlyPrice: 20,
      yearlyPrice: 16,
      features: [
        'Personalized recommendations',
        'Full catalog access',
        'HD streaming quality',
        '2 devices at a time',
        'Download for offline',
      ],
      buttonText: 'Get Standard',
      isHighlighted: true,
    },
    {
      planId: 'premium',
      title:'Premium',
      monthlyPrice: 20,
      yearlyPrice: 16,
      features: [
        'AI-powered recommendations',
        'Full catalog access',
        '4 devices at a time',
        'Exclusive premiers',
      ],
      buttonText: 'Get Premium',
    }, 
  ];

  const displayData = pricingData.map((plan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return { ...plan, price };
  });

  return(
    <section
      style={{
        backgroundColor: '#1C1C1C',
        padding: '60px 30px',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Choose Your Plan
      </h2>

      <div
        style={}
      >

      </div>
      </section>
  )

}
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
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        padding: '2rem',
        color: '#fff',
        textAlign: 'center',
        boxShadow: isHighlighted
          ? '0 0 12px rgba(87, 200, 244, 0.6)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        border: isHighlighted ? '2px solid #57C8F4' : '1px solid #333',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '1.6rem',
            marginBottom: '0.5rem',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          <span style={{ fontWeight: 700 }}>${price}</span>
          <span style={{ fontSize: '1rem', color: '#aaa' }}>/mo</span>
        </p>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#ccc',
            fontSize: '0.95rem',
          }}
        >
          {features.map((feature, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              {feature}
            </li>
          ))}
        </ul>
      </div>


      <Link
        to={`/register?plan=${planId}`}
        style={{
          backgroundColor: '#57C8F4',
          color: '#000',
          padding: '0.75rem 1.5rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          marginTop: '1.5rem',
          textDecoration: 'none',
          display: 'inline-block',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {buttonText}
      </Link>
    </div>
  );
};


export default PricingCard;