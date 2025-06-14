import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  pingAuth,
  login as apiLogin,
  register,
  createUserProfile,
  assignUserRole,
  isEmailUsed,
} from '../api/IdentityAPI';


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

function RegisterPage() {
  //loading functionality
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login: authLogin } = useAuth();

  // Step 2: Additional fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zip, setZip] = useState('');
  // Subscriptions
  const [netflix, setNetflix] = useState(false);
  const [amazonPrime, setAmazonPrime] = useState(false);
  const [disneyPlus, setDisneyPlus] = useState(false);
  const [paramountPlus, setParamountPlus] = useState(false);
  const [max, setMax] = useState(false);
  const [hulu, setHulu] = useState(false);
  const [appleTVPlus, setAppleTVPlus] = useState(false);
  const [peacock, setPeacock] = useState(false);

  // Error message state
  const [error, setError] = useState('');

  // Handle the next step validation
  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email format
    function isValidEmail(email: string): boolean {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }

    if (!email) {
      setError('Please enter an email');
      return;
    } else if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    } else {
      setError(''); // Reset error if email is valid
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 13) {
      setError('Password must be at least 13 characters long.');
      return;
    }

    const uniqueChars = new Set(password).size;
    if (uniqueChars < 2) {
      setError('Password must contain at least 2 unique characters.');
      return;
    }

    setError('');
    setStep(2);
  };

  // Handler to go back from Step 2 to Step 1
  const handleBack = () => {
    setStep(1);
  };

  // Check email availability after user stops typing (with debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (email) {
        const emailInUse = await isEmailUsed(email);
        if (emailInUse) {
          setError(
            'That email is already associated with an account. Please enter a different one.'
          );
        } else {
          setError('');
        }
      }
    }, 500); // 500ms delay to avoid multiple API calls while typing

    return () => clearTimeout(timer); // Cleanup timeout when email changes
  }, [email]);

  // Final form submission for Step 2
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      email,
      name,
      phone,
      age,
      gender,
      city,
      state: stateValue,
      zip,
      netflix,
      amazonPrime,
      disneyPlus,
      paramountPlus,
      max,
      hulu,
      appleTVPlus,
      peacock,
    };

    // Handles the full registration flow:
    // - Registers the user, logs them in, creates a profile, assigns a role
    // - Waits briefly to allow auth propagation
    // - Retrieves user data and navigates based on role
    // - Catches and displays any errors, and stops loading state when complete
    try {
      const authSuccess = await register(email, password);
      if (!authSuccess) {
        throw new Error('Authentication registration failed.');
      }

      const loginSuccess = await apiLogin(email, password, false);
      if (!loginSuccess) {
        throw new Error('Login failed.');
      }

      const profileSuccess = await createUserProfile(profileData);
      if (!profileSuccess) {
        throw new Error('Profile creation failed.');
      }

      const roleSuccess = await assignUserRole(email, 'User');
      if (!roleSuccess) {
        throw new Error('Role assignment failed.');
      }

      await new Promise((res) => setTimeout(res, 300));

      const userData = await pingAuth();
      if (userData) {
        authLogin(userData);
        if (userData.roles.includes('Administrator')) {
          navigate('/admin');
        } else if (userData.roles.includes('User')) {
          navigate('/movies');
        } else {
          navigate('/');
        }
      } else {
        setError('Failed to retrieve user details.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally{
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#fff',
    color: 'rgb(142,142,142)',
    border: 'none',
    borderRadius: '4px',
    marginBottom: '1rem',
  };
  const progressPercentage = step === 1 ? '50%' : '100%';

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
        }}
      >
        {/* // Renders the registration page header and subtext:
        // - Includes title, description, and a link for users who already have an account
        */}
        <h2
          style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}
        >
          Register
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Enter your email to create an account.
        </p>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Link
            to="/login"
            style={{ color: '#57c8f4', }}
          >
            <strong>I already have an account</strong>
          </Link>
        </div>

        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#ccc',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: progressPercentage,
              height: '100%',
              backgroundColor: '#57c8f4',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
         {/* If loading is true, show the spinner */}
         {loading ? (
          <Spinner />
        ) : (
        <>
        {step === 1 && (
          <form onSubmit={handleNext}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              title="Passwords must be 13 characters or more"
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#57c8f4',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1.5rem',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              min={18}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={inputStyle}
            />
            {/* Example for gender radio buttons */}
            <div style={{ marginBottom: '1rem', color: 'rgb(142,142,142)' }}>
              <label style={{ marginRight: '1rem' }}>Gender:</label>
              <label style={{ marginRight: '0.5rem' }}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === 'Male'}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label style={{ marginRight: '0.5rem' }}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === 'Female'}
                  onChange={(e) => setGender(e.target.value)}
                />{' '}
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === 'Other'}
                  onChange={(e) => setGender(e.target.value)}
                />{' '}
                Other
              </label>
            </div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={stateValue}
              onChange={(e) => setStateValue(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              name="zip"
              placeholder="Zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              style={inputStyle}
            />
            {/* Additional fields like subscriptions could follow similarly */}
            {/* Subscriptions checkboxes */}
            <h3>Select Your Current Subscriptions:</h3>
            <div className="mb-3">
              <div className="row">
                <div className="col-3">
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
                </div>
                <div className="col-3">
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
                </div>
                <div className="col-3">
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
                </div>
                <div className="col-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="paramountPlus"
                      checked={paramountPlus}
                      onChange={(e) => setParamountPlus(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="paramountPlus">
                      Paramount+
                    </label>
                  </div>
                </div>
                <div className="col-3 mt-2">
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
                </div>
                <div className="col-3 mt-2">
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
                </div>
                <div className="col-3 mt-2">
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
                </div>
                <div className="col-3 mt-2">
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
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <button
                type="button"
                onClick={handleBack}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#57c8f4',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#57c8f4',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1.5rem',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Register
              </button>
            </div>
          </form>
        )}
        </>
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

export default RegisterPage;
