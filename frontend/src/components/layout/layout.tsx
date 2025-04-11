import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GuestNavBar from './GuestNavBar';
import UserNavBar from './UserNavBar';
import AdminNavBar from './AdminNavBar';
import Footer from './Footer';
import TopHeader from './TopHeader';

// Compenetnt to track and display layout of things for logged in userss
const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Hide navbar on specific routes (e.g., /login)
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // For routes where we hide the navbar, simply render the Outlet and Footer
  if (shouldHideNavbar) {
    return (

      <div className="layout">
        <TopHeader/>
        <main>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }

  // If the user is logged in as a regular user, use a vertical sidebar layout
  if (user && user.roles.includes('User')) {
    return (
      <div className="layout d-flex">
        
        <aside className="side-navbar">
          <UserNavBar />
        </aside>
        <div className="main-content" style={{ marginLeft: '80px', flex: 1 }}>
      
        
        <main>
          <Outlet />
        </main>

        <footer>
          <Footer />
        </footer>
          
        </div>
      </div>
    );
  }

  // For guests or for admins, use the default header layout
  let NavBar;
  if (!user) {
    NavBar = GuestNavBar;
  } else if (user.roles.includes('Administrator')) {
    NavBar = AdminNavBar;
  } else if (user.roles.includes('User')){
    NavBar = UserNavBar;
  }else {
    NavBar = GuestNavBar; 
  }

  return (
    <div className="layout">
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
