import { Link } from 'react-router-dom';
import logo from '../../assets/Website_Logo.png'
import '../../css/theme.css'; // Custom CSS for the sidebar

function UserNavbar() {
  return (
    <nav className="side-navbar d-flex flex-column text-white" style={{ background: 'transparent' }}>
      {/* Logo or brand at the top */}
      
      <div className="nav-top">
        <ul className="nav flex-column text-center">
          <li className="nav-item my-3">
          <Link to="/" className="navbar-brand">
          <img src={logo} alt="My Logo" style={{ width: '70px', height: 'auto' }} />
        </Link>
          </li>
        </ul>
      </div>
      <div
        className="nav-main flex-grow-1 d-flex flex-column justify-content-center"
      >
        <ul className="nav flex-column text-center">
          {/* Search */}
          <li className="nav-item my-3">
            <Link to="/search" className="nav-link text-white">
              <i className="bi bi-search fs-2"></i>
            </Link>
          </li>
          {/* Home */}
          <li className="nav-item my-3">
            <Link to="/movies" className="nav-link text-white">
              <i className="bi bi-house fs-2"></i>
            </Link>
          </li>
          {/* Favorites */}
          <li className="nav-item my-3">
            <Link to="/favorites" className="nav-link text-white">
              <i className="bi bi-heart fs-2"></i>
            </Link>
          </li>
          {/* Add to Favorites or extra functionality */}
          <li className="nav-item my-3">
            <Link to="/add" className="nav-link text-white">
              <i className="bi bi-plus fs-2"></i>
            </Link>
          </li>
        </ul>
        </div>
        {/* Logout button anchored at the bottom */}
      <div className="nav-bottom">
        <ul className="nav flex-column text-center">
          <li className="nav-item my-3">
            <Link to="/logout" className="nav-link text-white">
              <i className="bi bi-box-arrow-right fs-2"></i>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default UserNavbar;