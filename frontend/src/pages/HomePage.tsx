import LandingHero from '../components/home/LandingHero';
// import FeaturedSection from '../components/home/FeaturedSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import PricingSection from '../components/home/PricingSection';
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
  return (
    <div>
      {shouldShow && showCookiesModal && (
        <CookiesModal setShowCookieModal={setShowCookieModal} />
      )}
      <LandingHero />
      <TestimonialsSection />
      <FAQSection />
      <PricingSection />
    </div>
  );
}

export default HomePage;
