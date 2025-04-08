import { Link } from 'react-router-dom';

function LandingHero() {
  return (
    <section className="landing-hero">
      <h1>Welcome to CineNiche</h1>
      <p>Stream your favorite shows and movies anytime, anywhere.</p>
      <Link to="/register" className="btn-primary">
        Get Started
      </Link>
    </section>
  );
}

export default LandingHero;
