import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin, pingAuth } from '../api/IdentityAPI';
import { useAuth } from '../context/AuthContext';

type UserData = {
  email: string;
  roles: string[];
};

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Get the login function from AuthContext
  const { login: authLogin } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // First, try to log in via the API
      const successfulLogin = await apiLogin(email, password, rememberme);

      if (!successfulLogin) {
        setError('Invalid email or password.');
      } else {
        // If login succeeds, call pingAuth to retrieve user details
        const userData: UserData | null = await pingAuth();
        console.log(userData);
        if (userData) {
          authLogin(userData);

          // Navigate based on user role
          switch (userData.roles[0]) {
            case 'Administrator':
              navigate('/admin');
              break;
            case 'User':
              navigate('/movies');
              break;
            case null:
            default:
              navigate('/');
              break;
          }
        } else {
          setError('Failed to retrieve user details.');
        }
      }
    } catch (error: any) {
      console.error('Fetch attempt failed:', error);
      setError(error.message || 'Unexpected error occurred during login.');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(87,200,244,0.1) 0%, rgba(21,21,21,0.99) 60%)',
      }}
    >
      <div
        className="login-container"
        style={{
          backgroundColor: 'transparent', // Semi-transparent background for the container
          padding: '2rem',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
          color: 'white',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email address"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#303030',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                marginBottom: '1rem',
              }}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#303030',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                marginBottom: '1rem',
              }}
            />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="rememberme"
              checked={rememberme}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            <label style={{ fontSize: '0.9rem' }}>Remember password</label>
          </div>
          <div>
          <button
              type="submit"
              className="nav-link sign-in-button" style={{
                fontSize: '1rem',
                borderRadius: '50px',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#57c8f4',
                border: 'none',
                color: '#fff',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                display: 'block',
                margin: '0 auto'
              }}// You can combine Bootstrap's btn if needed
            >
              Sign in
            </button>
          </div>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/forgot-password" style={{ color: '#57c8f4', marginBottom: '1rem', display: 'block' }}>
            Forgot Password?
          </Link>
          <Link to="/register" style={{ color: '#57c8f4', display: 'block' }}>
            Don't have an account?
          </Link>
        </div>
        {error && <p style={{ marginTop: '1rem', color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}
//     <div
//       className="login-page"
//       style={{
//         height: '100vh', // Full viewport height
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'radial-gradient(ellipse at center, rgba(87,200,244,0.1) 0%, rgba(21,21,21,0.99) 60%)', // or your chosen background color
//       }}
//     >
//       <div className="container" style={{ 
//       backgroundColor: 'rgba(0, 0, 0, 0.7)',
//       padding: '2rem',
//       borderRadius: '8px',
//       width: '90%',
//       maxWidth: '400px',
//       color: 'white',}}>
//         <div className="row">
//           <div className="card border-0 shadow rounded-3">
//             <div className="card-body p-4 p-sm-5">
//               <h5 className="card-title text-center mb-5 fw-light fs-5">
//                 Sign In
//               </h5>
//               <form onSubmit={handleSubmit}>
//                 <div className="form-floating mb-3">
//                   <input
//                     className="form-control"
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={email}
//                     onChange={handleChange}
//                   />
//                   <label htmlFor="email">Email address</label>
//                 </div>
//                 <div className="form-floating mb-3">
//                   <input
//                     className="form-control"
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={password}
//                     onChange={handleChange}
//                   />
//                   <label htmlFor="password">Password</label>
//                 </div>
//                 <div className="form-check mb-3">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="rememberme"
//                     name="rememberme"
//                     checked={rememberme}
//                     onChange={handleChange}
//                   />
//                   <label className="form-check-label" htmlFor="rememberme">
//                     Remember password
//                   </label>
//                 </div>
//                 <div className="d-grid mb-2">
//                   <button
//                     className="btn btn-primary btn-login text-uppercase fw-bold"
//                     type="submit"
//                   >
//                     Sign in
//                   </button>
//                 </div>
//                 <div className="d-grid mb-2">
//                   <button
//                     className="btn btn-primary btn-login text-uppercase fw-bold"
//                     type="button"
//                     onClick={handleRegisterClick}
//                   >
//                     Register
//                   </button>
//                 </div>
//               </form>
//               {error && <p className="error">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default LoginPage;
