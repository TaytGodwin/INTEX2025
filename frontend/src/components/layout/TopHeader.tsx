// TopHeader.tsx
import { Link } from 'react-router-dom';
import logo from '../../../public/assets/Cineniche.svg';
import React from 'react';

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
        padding: '1rem 0',
      }}
    >
      <div className="container-fluid d-flex justify-content-start align-items-center">
        <Link to="/" className="navbar-brand">
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#151515',
              outline: 'none',
              border: '#151515', // optional: background color
            }}
          >
            <img
              src={logo}
              alt="My Logo"
              style={{
                width: '95%',
                height: '95%',
                objectFit: 'contain',
                border: '#151515',
                outline: 'none',
              }}
            />
          </div>
        </Link>
      </div>
    </header>
  );
}

export default React.memo(TopHeader);
