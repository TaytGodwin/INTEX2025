import React, { useState } from 'react';
import PricingCard from './PricingCard';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleToggle = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };

  const pricingData = [
    {
      planId: 'free',
      title: 'Free Tier',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: ['List item', 'List item', 'List item'],
      buttonText: 'Get Free',
    },
    {
      planId: 'plus',
      title: 'Plus',
      monthlyPrice: 15,
      yearlyPrice: 12,
      features: ['List item', 'List item', 'List item', 'List item'],
      buttonText: 'Get Plus',
      isHighlighted: true,
    },
    {
      planId: 'premium',
      title: 'Premium',
      monthlyPrice: 25,
      yearlyPrice: 20,
      features: ['List item', 'List item', 'List item', 'List item', 'List item'],
      buttonText: 'Get Premium',
    },
  ];

  const displayedData = pricingData.map((plan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return { ...plan, price };
  });

  return (
    <section className="pricing-section">
      <div className="billing-toggle d-flex justify-content-center">
        <button
          className={`btn me-2 ${billingCycle === 'monthly' ? 'btn-primary' : ''}`}
          onClick={() => handleToggle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`btn ${billingCycle === 'yearly' ? 'btn-primary' : ''}`}
          onClick={() => handleToggle('yearly')}
        >
          Yearly
        </button>
      </div>
      <div className="row g-4">
        {displayedData.map((plan, index) => (
          <div className="col-md-4" key={index}>
            <PricingCard
              title={plan.title}
              price={plan.price}
              features={plan.features}
              buttonText={plan.buttonText}
              isHighlighted={plan.isHighlighted}
              planId={plan.planId}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
