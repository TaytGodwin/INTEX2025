
import { Link } from 'react-router-dom';

function LandingHeader() {
  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <div className="logo">
        {/* Replace with your actual logo or text */}
        <h2>MyFlix</h2>
      </div>
      <div>
        <Link to="/login" className="btn btn-outline-primary">
          Sign In
        </Link>
      </div>
    </header>
  );
}

export default LandingHeader;