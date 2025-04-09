import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
interface RegisterPageProps {
  identityApiUrl: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ identityApiUrl }) => {
  const navigate = useNavigate();

  // Form step: 1 for initial info (email, password, confirm password), 2 for additional info
  const [step, setStep] = useState(1);

  // Step 1: Email and password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  // Handler to move from Step 1 to Step 2
  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Additional validation for step 1 can be added here
    setError('');
    setStep(2);
  };

  // Handler to go back from Step 2 to Step 1
  const handleBack = () => {
    setStep(1);
  };

  // Handler for navigating to the login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Generic change handler for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'state':
        setStateValue(value);
        break;
      case 'zip':
        setZip(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      // Handle checkboxes for subscriptions
      case 'netflix':
        setNetflix(checked);
        break;
      case 'amazonPrime':
        setAmazonPrime(checked);
        break;
      case 'disneyPlus':
        setDisneyPlus(checked);
        break;
      case 'paramountPlus':
        setParamountPlus(checked);
        break;
      case 'max':
        setMax(checked);
        break;
      case 'hulu':
        setHulu(checked);
        break;
      case 'appleTVPlus':
        setAppleTVPlus(checked);
        break;
      case 'peacock':
        setPeacock(checked);
        break;
      default:
        break;
    }
  };

  // Final form submission for Step 2
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare the two sets of data
    const authData = {
      email,
      password,
    };

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

    try {
      // 1. Send auth data to authentication API
      const authResponse = await fetch(`${identityApiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData),
      });

      if (!authResponse.ok) {
        throw new Error('Authentication registration failed.');
      }

      // 2. Send profile data to profile API
      const profileResponse = await fetch(
        `${identityApiUrl}/api/User/CreateUser`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        }
      );

      if (!profileResponse.ok) {
        throw new Error('Profile creation failed.');
      }

      // 3. Assign role
      const roleResponse = await fetch(
        `${identityApiUrl}/api/Role/AssignRoleToUser`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role: 'User' }),
        }
      );

      if (!roleResponse.ok) {
        throw new Error('Role assignment failed.');
      }

      // Navigate after both succeed
      navigate('/movies');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#fff', // white background for each input box
    color: 'rgb(142,142,142)', // gray text
    border: 'none',
    borderRadius: '4px',
    marginBottom: '1rem',
  };
  const progressPercentage = step === 1 ? '50%' : '100%';

  return (
    <div
      style={{
        backgroundColor: 'rgb(238,238,238)', // overall page background
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Transparent container for the form */}
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'transparent',
        }}
      >
        <h2
          style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}
        >
          Register
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Enter your email to create an account.
        </p>
        {/* Link for users who already have an account */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Link
            to="/login"
            style={{ color: '#57c8f4', textDecoration: 'underline' }}
          >
            I already have a login
          </Link>
        </div>

        {/* Progress Bar */}
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
                />{' '}
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
        {error && (
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'red' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );

  // <div className="container">
  //   <div className="row">
  //     <div className="card border-0 shadow rounded-3 ">
  //       <div className="card-body p-4 p-sm-5">
  //         <h5 className="card-title text-center mb-5 fw-light fs-5">
  //           Register
  //         </h5>

  //         {/* ALREADY HAVE ACCOUNT */}
  //         <div className="d-grid mb-2">
  //           <button
  //             className="btn btn-primary btn-login text-uppercase fw-bold"
  //             onClick={handleLoginClick}
  //           >
  //             I already have a login
  //           </button>
  //         </div>

  //         {/* FORM */}
  //         <form onSubmit={handleSubmit}>
  //           {/* NAME TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="text"
  //               id="name"
  //               name="name"
  //               value={name}
  //               onChange={(e) => setName(e.target.value)} // Correctly pass a function reference
  //             />
  //             <label htmlFor="name">Full Name</label>
  //           </div>

  //           {/* PHONE NUMBER TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="number"
  //               id="phone"
  //               name="phone"
  //               value={phone}
  //               onChange={(e) => setPhone((e.target.value))} // Correctly pass a function reference
  //             />
  //             <label htmlFor="phone">Phone Number</label>
  //           </div>

  //           {/* AGE */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="number"
  //               id="age"
  //               min={18}
  //               max={120}
  //               name="age"
  //               value={age}
  //               onChange={(e) => setAge(Number(e.target.value))} // Correctly pass a function reference
  //             />
  //             <label htmlFor="age">Age</label>
  //           </div>

  //           {/* GENDER RADIO BUTTONS */}
  //           <label className="form-label d-block">Gender</label>
  //           <div className="form-floating mb-3">
  //             <div className="form-check form-check-inline">
  //               <input
  //                 className="form-check-input"
  //                 type="radio"
  //                 name="gender"
  //                 id="genderMale"
  //                 value="Male"
  //                 checked={gender === 'Male'}
  //                 onChange={handleChange}
  //               />
  //               <label className="form-check-label" htmlFor="genderMale">Male</label>
  //             </div>
  //             <div className="form-check form-check-inline">
  //               <input
  //                 className="form-check-input"
  //                 type="radio"
  //                 name="gender"
  //                 id="genderFemale"
  //                 value="Female"
  //                 checked={gender === 'Female'}
  //                 onChange={handleChange}
  //               />
  //               <label className="form-check-label" htmlFor="genderFemale">Female</label>
  //             </div>
  //           <div className="form-check form-check-inline">
  //             <input
  //                 className="form-check-input"
  //                 type="radio"
  //                 name="gender"
  //                 id="genderOther"
  //                 value="Other"
  //                 checked={gender === 'Other'}
  //                 onChange={handleChange}
  //               />
  //               <label className="form-check-label" htmlFor="genderOther">Other</label>
  //           </div>
  //           </div>

  //           {/* CITY TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="city"
  //               id="city"
  //               name="city"
  //               value={city}
  //               onChange={handleChange}
  //             />
  //             <label htmlFor="city">City</label>
  //           </div>

  //           {/* STATE TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="state"
  //               id="state"
  //               name="state"
  //               value={state}
  //               onChange={handleChange}
  //             />
  //             <label htmlFor="state">State</label>
  //           </div>

  //           {/* ZIP TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="zip"
  //               id="zip"
  //               name="zip"
  //               value={zip}
  //               onChange={handleChange}
  //             />
  //             <label htmlFor="zip">Zip</label>
  //           </div>

  //           {/* SUBSCRIPTIONS MULTI-SELECT */}
  //          <h6 className="form-label d-block">Select Your Current Subscriptions:</h6>
  //          <div className="mb-3">
  //             <div className="row">
  //               <div className="col-3">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="netflix"
  //                     checked={netflix}
  //                     onChange={(e) => setNetflix(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="netflix">
  //                     Netflix
  //                   </label>
  //                 </div>
  //               </div>
  //               <div className="col-3">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="amazonPrime"
  //                     checked={amazonPrime}
  //                     onChange={(e) => setAmazonPrime(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="amazonPrime">
  //                     Amazon Prime
  //                   </label>
  //                 </div>
  //               </div>
  //               <div className="col-3">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="disneyPlus"
  //                     checked={disneyPlus}
  //                     onChange={(e) => setDisneyPlus(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="disneyPlus">
  //                     Disney+
  //                   </label>
  //                 </div>
  //               </div>
  //               <div className="col-3">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="paramountPlus"
  //                     checked={paramountPlus}
  //                     onChange={(e) => setParamountPlus(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="paramountPlus">
  //                     Paramount+
  //                   </label>
  //                 </div>
  //               </div>

  //               <div className="col-3 mt-2">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="max"
  //                     checked={max}
  //                     onChange={(e) => setMax(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="max">
  //                     Max
  //                   </label>
  //                 </div>
  //               </div>
  //               <div className="col-3 mt-2">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="hulu"
  //                     checked={hulu}
  //                     onChange={(e) => setHulu(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="hulu">
  //                     Hulu
  //                   </label>
  //                 </div>
  //               </div>
  //               <div className="col-3 mt-2">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="appleTVPlus"
  //                     checked={appleTVPlus}
  //                     onChange={(e) => setAppleTVPlus(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="appleTVPlus">
  //                     Apple TV+
  //                   </label>
  //                 </div>
  //               </div>
  //               <div className="col-3 mt-2">
  //                 <div className="form-check">
  //                   <input
  //                     className="form-check-input"
  //                     type="checkbox"
  //                     id="peacock"
  //                     checked={peacock}
  //                     onChange={(e) => setPeacock(e.target.checked)}
  //                   />
  //                   <label className="form-check-label" htmlFor="peacock">
  //                     Peacock
  //                   </label>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* EMAIL TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="email"
  //               id="email"
  //               name="email"
  //               value={email}
  //               onChange={handleChange}
  //             />
  //             <label htmlFor="email">Email address</label>
  //           </div>

  //           {/* PASSWORD TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="password"
  //               id="password"
  //               name="password"
  //               value={password}
  //               onChange={handleChange}
  //             />
  //             <label htmlFor="password">Password</label>
  //           </div>

  //           {/* CONFIRM PASSWORD TEXT BOX */}
  //           <div className="form-floating mb-3">
  //             <input
  //               className="form-control"
  //               type="password"
  //               id="confirmPassword"
  //               name="confirmPassword"
  //               value={confirmPassword}
  //               onChange={handleChange}
  //             />
  //             <label htmlFor="confirmPassword">Confirm Password</label>
  //           </div>

  //           {/* SUBMIT FORM */}

  //           {/* REGISTER */}
  //           <div className="d-grid mb-2">
  //             <button
  //               className="btn btn-primary btn-login text-uppercase fw-bold"
  //               type='submit'
  //             >
  //               Register
  //             </button>
  //           </div>
  //         </form>
  //         <strong>{error && <p className="error">{error}</p>}</strong>
  //       </div>
  //     </div>
  //   </div>
  // </div>
};

export default RegisterPage;
