import { Link } from 'react-router-dom';

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="logo">
        <h2>CineNiche</h2>
      </div>
      <div>
        <Link to="/login" className="btn-outline-primary">
          Sign In
        </Link>
      </div>
    </header>
  );
}

export default LandingHeader;
