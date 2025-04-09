import { Link } from 'react-router-dom';
import '../../css/theme.css'; // Custom CSS for the sidebar

function UserNavbar() {
  return (
    <nav className="side-navbar d-flex flex-column bg-dark text-white">
      {/* Logo or brand at the top */}

      <ul className="nav flex-column mt-3">
        {/* Search */}
        <li className="nav-item my-3 text-center">
          <Link to="/search" className="nav-link text-white">
            <i className="bi bi-search fs-2"></i>
            {/* Optionally show a tooltip or label */}
          </Link>
        </li>
        {/* Home */}
        <li className="nav-item my-3 text-center">
          <Link to="/movies" className="nav-link text-white">
            <i className="bi bi-house fs-2"></i>
          </Link>
        </li>
        {/* For you page?*/}
        <li className="nav-item my-3 text-center">
          <Link to="/favorites" className="nav-link text-white">
            <i className="bi bi-heart fs-2"></i>
          </Link>
        </li>
        {/* Repeat Errors*/}
        <li className="nav-item my-3 text-center">
          <Link to="/recommendations" className="nav-link text-white">
            <i className="bi bi-arrow-repeat fs-2"></i>
          </Link>
        </li>
        {/* Add to a favorites List EXTRA STUFF */}
        <li className="nav-item my-3 text-center">
          <Link to="/add" className="nav-link text-white">
            <i className="bi bi-plus fs-2"></i>
          </Link>
        </li>
        <li className="nav-item my-3 text-center">
          <Link to="/logout" className="nav-link text-white">
            <i className="bi bi-arrow-repeat fs-2"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default UserNavbar;
