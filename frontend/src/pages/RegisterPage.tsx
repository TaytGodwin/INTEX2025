import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/IdentityAPI';

function RegisterPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [netflix, setNetflix] = useState(false);
  const [amazonPrime, setAmazonPrime] = useState(false);
  const [disneyPlus, setDisneyPlus] = useState(false);
  const [paramountPlus, setParamountPlus] = useState(false);
  const [max, setMax] = useState(false);
  const [hulu, setHulu] = useState(false);
  const [appleTVPlus, setAppleTVPlus] = useState(false);
  const [peacock, setPeacock] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // state variable for error messages
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    navigate('/login');
  };

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // handle submit event for the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate email and passwords
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      // clear error message
      setError('');
      // post data to the /register api
      const success = await register(email, password);

      if (success) {
        setError('✅ Successfully registered! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('Registration failed. Try again or check your password.');
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="card border-0 shadow rounded-3 ">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">
              Register
            </h5>
            <div className="d-grid mb-2">
              <button
                className="btn btn-primary btn-login text-uppercase fw-bold"
                onClick={handleLoginClick}
              >
                I already have a login
              </button>
            </div>
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
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>

              {/* Additional Columns for User information */}

              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="age"
                  id="age"
                  name="age"
                  value={age}
                  onChange={handleChange}
                />
                <label htmlFor="age">Age</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="gender"
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                />
                <label htmlFor="gender">Gender</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="city"
                  id="city"
                  name="city"
                  value={city}
                  onChange={handleChange}
                />
                <label htmlFor="city">City</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="state"
                  id="state"
                  name="state"
                  value={state}
                  onChange={handleChange}
                />
                <label htmlFor="state">State</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="zip"
                  id="zip"
                  name="zip"
                  value={zip}
                  onChange={handleChange}
                />
                <label htmlFor="zip">Zip</label>
              </div>

              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  type="submit"
                >
                  <div className="mb-3">
                    <h6>Select Your Current Subscriptions:</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="netflix"
                        checked={netflix}
                        onChange={(e) => setNetflix(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="netflix">
                        Netflix
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="amazonPrime"
                        checked={amazonPrime}
                        onChange={(e) => setAmazonPrime(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="amazonPrime">
                        Amazon Prime
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="disneyPlus"
                        checked={disneyPlus}
                        onChange={(e) => setDisneyPlus(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="disneyPlus">
                        Disney+
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="paramountPlus"
                        checked={paramountPlus}
                        onChange={(e) => setParamountPlus(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="paramountPlus"
                      >
                        Paramount+
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="max"
                        checked={max}
                        onChange={(e) => setMax(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="max">
                        Max
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="hulu"
                        checked={hulu}
                        onChange={(e) => setHulu(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="hulu">
                        Hulu
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="appleTVPlus"
                        checked={appleTVPlus}
                        onChange={(e) => setAppleTVPlus(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="appleTVPlus">
                        Apple TV+
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="peacock"
                        checked={peacock}
                        onChange={(e) => setPeacock(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="peacock">
                        Peacock
                      </label>
                    </div>
                  </div>
                  Register
                </button>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  onClick={handleLoginClick}
                >
                  Go to Login
                </button>
              </div>
            </form>
            <strong>{error && <p className="error">{error}</p>}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
