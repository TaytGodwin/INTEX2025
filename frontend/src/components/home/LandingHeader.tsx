import React from 'react';
import { Link } from 'react-router-dom';

// Renders the landing page header:
// - Displays the CineNiche logo and a "Sign In" button linking to the login page
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

export default React.memo(LandingHeader);
