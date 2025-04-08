
import LandingHeader from '../components/home/LandingHeader';
import LandingHero from '../components/home/LandingHero';
import FeaturedSection from '../components/home/FeaturedSection';
import Footer from '../components/layout/Footer'; // If you have a shared footer
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
      <TestimonialsSection/>
      <FAQSection/>
      <PricingSection/>
      <div className="text-center py-5">
      <Link to="/register" className="btn btn-lg btn-primary">
        Get Started Now
      </Link>
      </div>
     
    </div>
  );
}

export default HomePage;
