import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} This is Intex
        </p>
        <div style={linkContainerStyle}>
          <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
          <Link to="/terms-of-use" style={linkStyle}>Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#255c99',
  color: '#fff',
  padding: '1rem 0',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  textAlign: 'center' as const,
  gap: '0.5rem',
};

const linkContainerStyle = {
  display: 'flex',
  gap: '1.5rem',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
};

export default Footer;
