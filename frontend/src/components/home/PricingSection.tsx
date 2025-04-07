import React, { useState } from 'react';
import PricingCard from './PricingCard';

const PricingSection: React.FC = () => {
  // Toggle state: monthly or yearly
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleToggle = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };

  // Sample pricing data
  const pricingData = [
    {
      planId: 'free',
      title: 'Free Tier',
      monthlyPrice: 0,
      yearlyPrice: 0, // same as monthly for free
      features: ['List item', 'List item', 'List item'],
      buttonText: 'Get Free',
    },
    {
      planId: 'plus',
      title: 'Plus',
      monthlyPrice: 15,
      yearlyPrice: 12, // example: $12/month if billed yearly
      features: ['List item', 'List item', 'List item', 'List item'],
      buttonText: 'Get Plus',
      isHighlighted: true, // highlight the middle plan
    },
    {
      planId: 'premium',
      title: 'Premium',
      monthlyPrice: 25,
      yearlyPrice: 20, // example: $20/month if billed yearly
      features: ['List item', 'List item', 'List item', 'List item', 'List item'],
      buttonText: 'Get Premium',
    },
  ];

  // Decide the displayed price based on billing cycle
  const displayedData = pricingData.map((plan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return { ...plan, price };
  });

  return (
    <section className="container my-5">
      <div className="billing-toggle d-flex justify-content-center mb-4">
        <button
          className={`btn me-2 ${billingCycle === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleToggle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`btn ${billingCycle === 'yearly' ? 'btn-primary' : 'btn-outline-primary'}`}
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