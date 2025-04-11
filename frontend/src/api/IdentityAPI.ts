const Identity_API_URL = //'https://localhost:5000';
  'https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net';

interface LoggedInUser {
  email: string;
  roles: string[];
}

// API call to ping the backend to check if the user is logged in
export const pingAuth = async (): Promise<LoggedInUser | null> => {
  try {
    const response = await fetch(`${Identity_API_URL}/api/Identity/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
    console.log('pingAuth status:', response.status);
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await response.text(); // 👈 Capture raw response
      console.error('Invalid response format from server:', errorText); // 👈 Log it
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();

    if (data.email && data.roles) {
      return { email: data.email, roles: data.roles }; // return full object
    } else {
      return null; // no email = not authenticated
    }
  } catch (error) {
    console.error(
      'pingAuth error:',
      error instanceof Error ? error.message : error
    );
    return null; // or you could re-throw if you want the caller to handle it
  }
};

// This call logs the user in
export const login = async (
  email: string,
  password: string,
  rememberme: boolean
): Promise<boolean> => {
  const loginUrl = rememberme
    ? `${Identity_API_URL}/login?useCookies=true`
    : `${Identity_API_URL}/login?useSessionCookies=true`;

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 0) {
      await response.json(); // you can parse this if needed
    }

    return response.ok; // ✅ true if status is 2xx, false otherwise
  } catch (err) {
    console.error('Login request failed:', err);
    return false; // ✅ fail gracefully
  }
};

// This will log a user out
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${Identity_API_URL}/api/Identity/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (err) {
    console.error('Logout request failed:', err);
    return false;
  }
};

// This will register a user - we may need to determine whether its admin or not
export const register = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${Identity_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return response.ok; // ✅ true if 200–299, false otherwise
  } catch (error) {
    console.error('Register request failed:', error);
    return false;
  }
};

export const createUserProfile = async (
  profileData: object
): Promise<boolean> => {
  try {
    const response = await fetch(`${Identity_API_URL}/api/Users/CreateUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return response.ok;
  } catch (error) {
    console.error('Create user profile failed:', error);
    return false;
  }
};

export const assignUserRole = async (
  userEmail: string,
  roleName: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${Identity_API_URL}/Role/AssignRoleToUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, roleName }),
    });
    return response.ok;
  } catch (error) {
    console.error('Assign user role failed:', error);
    return false;
  }
};

// Set the cookie consent in both the server and browser
export const SetCookie = async (consent: boolean): Promise<boolean> => {
  try {
    const response = await fetch(
      `${Identity_API_URL}/api/identity/SetCookie?consent=${consent}`,
      {
        method: 'GET',
        credentials: 'include', // This is important for cross-origin cookie handling
        headers: {
          'Content-Type': 'application/json', // Ensure the correct content type
        },
      }
    );

    if (response.ok) {
      return true; // Return true if the cookie is set or deleted
    }
    return false;
  } catch (error) {
    console.error('Error setting cookie consent:', error);
    return false;
  }
};

// This API call checks to see if an email is already in the database and returns true if it is
export const isEmailUsed = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${Identity_API_URL}/api/identity/isEmailUsed`, // API URL
      {
        method: 'POST', // POST to send data
        headers: {
          'Content-Type': 'application/json', // Ensure Content-Type is application/json
        },
        credentials: 'include', // Ensure the browser sends cookies
        body: JSON.stringify({ email }), // Send email as JSON in the body
      }
    );

    // Check if the response is OK (status code in the range 200-299)
    if (response.ok) {
      const data = await response.json(); // Parse JSON response from the server
      return data.exists; // Assuming your API returns an object with a field 'exists'
    } else {
      console.error('Email checking failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error during email checking:', error);
    return false;
  }
};
