// TopHeader.tsx
import { Link } from 'react-router-dom';
import logo from '../../assets/Website_logo.png';

function TopHeader() {
  return (
    <header
      className="top-header"
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: 'transparent',
        zIndex: 1000,
        padding: '1rem 0'
      }}
    >
      <div className="container-fluid d-flex justify-content-start align-items-center">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="My Logo" style={{ width: '150px', height: 'auto' }} />
        </Link>
      </div>
    </header>
  );
}

export default TopHeader;
