const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} This is Intex
        </p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#255c99',
  color: '#fff',
  padding: '1rem 0',
  textAlign: 'center' as const, // helps with TypeScript
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  textAlign: 'center' as const,
};

export default Footer;
