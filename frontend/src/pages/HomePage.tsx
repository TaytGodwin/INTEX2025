import LandingHero from '../components/home/LandingHero';
import FeaturedSection from '../components/home/FeaturedSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import PricingSection from '../components/home/PricingSection';
import { Link } from 'react-router-dom';

// This is the page that doesn't have info

function HomePage() {
  return (
    <div>
      <LandingHero />
      <FeaturedSection />

      <TestimonialsSection />
      <FAQSection />
      <PricingSection />
    </div>
  );
}

export default HomePage;
