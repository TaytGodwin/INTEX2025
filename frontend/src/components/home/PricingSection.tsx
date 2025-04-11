import React, { useState } from 'react';
import PricingCard from './PricingCard';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const handleToggle = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };
  const pricingData = [
    {
      planId: 'basic',
      title: 'Basic',
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
      title: 'Standard',
      monthlyPrice: 10,
      yearlyPrice: 8,
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
      title: 'Premium',
      monthlyPrice: 20,
      yearlyPrice: 16,
      features: [
        'AI-powered recommendations',
        'Everything in Standard',
        '4 devices at a time',
        'Exclusive premieres',
      ],
      buttonText: 'Get Premium',
    },
  ];
  const displayedData = pricingData.map((plan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return { ...plan, price };
  });
  
  // Renders the pricing section:
  // - Displays toggle buttons for monthly/yearly billing
  // - Dynamically calculates prices based on selected billing cycle
  // - Maps each plan to a styled PricingCard component
  return (
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
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => handleToggle('monthly')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: billingCycle === 'monthly' ? '#57C8F4' : '#333',
            color: billingCycle === 'monthly' ? '#000' : '#fff',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Pay per Month
        </button>
        <button
          onClick={() => handleToggle('yearly')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: billingCycle === 'yearly' ? '#57C8F4' : '#333',
            color: billingCycle === 'yearly' ? '#000' : '#fff',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Pay per Year
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        {displayedData.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            price={plan.price}
            features={plan.features}
            buttonText={plan.buttonText}
            isHighlighted={plan.isHighlighted}
            planId={plan.planId}
          />
        ))}
      </div>
    </section>
  );
};
export default PricingSection;