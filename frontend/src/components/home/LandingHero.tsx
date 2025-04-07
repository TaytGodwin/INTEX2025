
import { Link } from 'react-router-dom';

function LandingHero() {
  return (
    <section className="text-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <h1 className="mb-4">Welcome to MyFlix</h1>
      <p className="mb-5">Stream your favorite shows and movies anytime, anywhere.</p>
      <Link to="/register" className="btn btn-lg btn-primary">
        Get Started
      </Link>
    </section>
  );
}

export default LandingHero;