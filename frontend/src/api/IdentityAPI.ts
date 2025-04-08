const Identity_API_URL = 'https://localhost:5000';
//'https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net';

interface LoggedInUser {
  // This is what the first call will return
  email: string;
}

// API call to ping the backend to check if the user is logged in
export const pingAuth = async (): Promise<LoggedInUser | null> => {
  try {
    console.log('line12');
    const response = await fetch(`${Identity_API_URL}/api/Identity/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
    const contentType = response.headers.get('content-type');

    // Ensure response is JSON
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();

    if (data.email) {
      return { email: data.email }; // return full object
    } else {
      return null; // no email = not authenticated
    }
  } catch (error) {
    console.error('pingAuth error:', error);
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
