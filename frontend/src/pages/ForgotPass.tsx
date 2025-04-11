import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isEmailUsed } from '../api/IdentityAPI';

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" />
    <style>
      {`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #57C8F4;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

function ForgotPass() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#fff',
    color: 'rgb(142,142,142)',
    border: 'none',
    borderRadius: '4px',
    marginBottom: '1rem',
  };

  // Simulated forgot password submission handler
  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        
        await new Promise(resolve => setTimeout(resolve, 3000));

      // Use the API call to check if the email is associated with an account.
      const exists = await isEmailUsed(email);
      setAccountExists(exists);
      setSubmitted(true);

      if (exists) {
        // If an account exists, simulate sending an email then redirect to login.
        setTimeout(() => {
          navigate('/login');
        }, 10000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'rgb(238,238,238)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'transparent',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Forgot Password
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Enter your email to reset your password.
        </p>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Link to="/login" style={{ color: '#57c8f4' }}>
            <strong>Back to Login</strong>
          </Link>
        </div>

        {loading ? (
            <Spinner />
            ) : submitted ? (
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#333' }}>
                {accountExists
                    ? "An account with that email exists, you'll receive an email shortly with password reset instructions. Redirecting to login..."
                    : 'This email is not associated with any account.'}
                </p>
                <button
                onClick={() => {
                    // Reset the state so that the form reappears.
                    setSubmitted(false);
                    setError('');
                    // Optionally clear the email field if desired:
                    // setEmail('');
                }}
                style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#57c8f4',
                    color: '#fff',
                    cursor: 'pointer',
                }}
                >
                Try Again
                </button>
            </div>
            ) : (
            <form onSubmit={handleForgotSubmit}>
                <input
                type="email"
                name="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
                />
                <button
                type="submit"
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: '#57c8f4',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                }}
                >
                Submit
                </button>
            </form>
            )}

        {error && (
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'red' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPass;