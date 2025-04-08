import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
