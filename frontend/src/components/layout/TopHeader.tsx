// TopHeader.tsx
import React from 'react';
import logo from '../../assets/Website_logo.png';

function TopHeader() {
  return (
    <header className="top-header bg-dark text-white d-flex align-items-center p-2">
      <div className="logo-container d-flex align-items-center">
        <img
          src={logo}
          alt="Logo"
          style={{ width: '60px', height: 'auto', marginRight: '0.5rem' }}
        />
        <span className="fs-4 fw-bold">CineNiche</span>
      </div>
    </header>
  );
}

export default TopHeader;


