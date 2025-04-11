import React from 'react';
import logo from '../../../public/assets/logos/Website_Logo.svg';
import '../../css/theme.css'; // We'll define some CSS for the fixed positioning

interface TopBarProps {
  userName: string;
}

const TopBar: React.FC<TopBarProps> = ({ userName }) => {
  return (
    <header className="top-bar">
      <div className="logo-container d-flex align-items-center">
        <img
          src={logo}
          alt="Logo"
          style={{ width: '100px', height: 'auto', marginRight: '0.5rem' }}
        />
        <span className="fs-4 fw-bold"></span>
      </div>
      <div className="top-bar-right">
        <div
          className="welcome-message"
          style={{ width: '160px', height: 'auto' }}
        >
          Welcome {userName}!
        </div>
      </div>
    </header>
  );
};

export default React.memo(TopBar);
