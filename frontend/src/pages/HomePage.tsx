import LandingHero from '../components/home/LandingHero';
import FeaturedSection from '../components/home/FeaturedSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import PricingSection from '../components/home/PricingSection'; // Import PricingSection
import { Link } from 'react-router-dom';
import CookiesModal from '../components/home/CookiesModal';
import { useEffect, useState } from 'react';

// This is the page that doesn't have info
function HomePage() {
  const [shouldShow, setShouldShow] = useState(false);
  const [showCookiesModal, setShowCookieModal] = useState(true);

  useEffect(() => {
    // Check if consent has already been given
    const hasConsent = document.cookie.includes('CookieConsent=true');
    if (!hasConsent) {
      setShouldShow(true);
    }
  }, []);

  // Pricing data to pass as props to PricingSection
  const pricingData = [
    {
      title: 'Basic Plan',
      price: 9.99,
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      buttonText: 'Get Started',
      planId: 'basic-plan',
    },
    {
      title: 'Pro Plan',
      price: 19.99,
      features: ['Feature A', 'Feature B', 'Feature C'],
      buttonText: 'Get Started',
      planId: 'pro-plan',
    },
    {
      title: 'Premium Plan',
      price: 29.99,
      features: ['Feature X', 'Feature Y', 'Feature Z'],
      buttonText: 'Get Started',
      planId: 'premium-plan',
    },
  ];

  return (
    <div>
      {shouldShow && showCookiesModal && (
        <CookiesModal setShowCookieModal={setShowCookieModal} />
      )}
      <LandingHero />
      <TestimonialsSection />
      <FAQSection />

      {/* Pass the pricing data to PricingSection */}
      

    
    </div>
  );
}

export default HomePage;
