// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login, pingAuth } from '../api/IdentityAPI';
// function LoginPage() {
//   // state variables for email and passwords
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [rememberme, setRememberme] = useState<boolean>(false);
//   // state variable for error messages
//   const [error, setError] = useState<string>('');
//   const navigate = useNavigate();
//   // handle change events for input fields
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, type, checked, value } = e.target;
//     if (type === 'checkbox') {
//       setRememberme(checked);
//     } else if (name === 'email') {
//       setEmail(value);
//     } else if (name === 'password') {
//       setPassword(value);
//     }
//   };
//   const handleRegisterClick = () => {
//     navigate('/register');
//   };
//   // handle submit event for the form
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(''); // Clear any previous errors

//     // First check if email and password have been filled
//     if (!email || !password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     // try logging in
//     try {
//       // First, try to log in
//       const successfulLogin = await login(email, password, rememberme);

//       if (!successfulLogin) {
//         setError('Invalid email or password.');
//       } else {
//         // If login succeeds, call pingAuth to retrieve user details
//         const userData = await pingAuth();
//         if (userData) {
//           // Update the AuthContext with the user data
//           authLogin(userData);
//           // Navigate to the home page (or the protected area that uses UserNavBar)
//           navigate('/');
//         } else {
//           setError('Failed to retrieve user details.');
//         }
//       }
//     } catch (error: any) {
//       console.error('Fetch attempt failed:', error);
//       setError(error.message || 'Unexpected error occurred during login.');
//     }
//   };
//   return (
//     <div className="container">
//       <div className="row">
//         <div className="card border-0 shadow rounded-3 ">
//           <div className="card-body p-4 p-sm-5">
//             <h5 className="card-title text-center mb-5 fw-light fs-5">
//               Sign In
//             </h5>
//             <form onSubmit={handleSubmit}>
//               <div className="form-floating mb-3">
//                 <input
//                   className="form-control"
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={email}
//                   onChange={handleChange}
//                 />
//                 <label htmlFor="email">Email address</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   className="form-control"
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={password}
//                   onChange={handleChange}
//                 />
//                 <label htmlFor="password">Password</label>
//               </div>
//               <div className="form-check mb-3">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   value=""
//                   id="rememberme"
//                   name="rememberme"
//                   checked={rememberme}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label" htmlFor="rememberme">
//                   Remember password
//                 </label>
//               </div>
//               <div className="d-grid mb-2">
//                 <button
//                   className="btn btn-primary btn-login text-uppercase fw-bold"
//                   type="submit"
//                 >
//                   Sign in
//                 </button>
//               </div>
//               <div className="d-grid mb-2">
//                 <button
//                   className="btn btn-primary btn-login text-uppercase fw-bold"
//                   onClick={handleRegisterClick}
//                 >
//                   Register
//                 </button>
//               </div>
//               <hr className="my-4" />
//               {/* <div className="d-grid mb-2">
//                 <button
//                   className="btn btn-google btn-login text-uppercase fw-bold"
//                   type="button"
//                 >
//                   <i className="fa-brands fa-google me-2"></i> Sign in with
//                   Google
//                 </button>
//               </div>
//               <div className="d-grid mb-2">
//                 <button
//                   className="btn btn-facebook btn-login text-uppercase fw-bold"
//                   type="button"
//                 >
//                   <i className="fa-brands fa-facebook-f me-2"></i> Sign in with
//                   Facebook
//                 </button>
//               </div> */}
//             </form>
//             {error && <p className="error">{error}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default LoginPage;
// function authLogin(userData: any) {
//   throw new Error('Function not implemented.');
// }



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, pingAuth } from '../api/IdentityAPI';
import { useAuth } from '../context/AuthContext';

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
        const userData = await pingAuth();
        if (userData) {
          // Update the AuthContext with the user data
          authLogin(userData);
          // Navigate to the home page (or protected area)
          navigate('/');
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
    <div className="container">
      <div className="row">
        <div className="card border-0 shadow rounded-3">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">
              Sign In
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberme"
                  name="rememberme"
                  checked={rememberme}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="rememberme">
                  Remember password
                </label>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  type="button"
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              </div>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;