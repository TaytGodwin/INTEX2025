// This component checks if the user is authenticated. If they are, it stores their email and allows access to child components
// If they are not authorized, it redirects them to /login
import React, { useState, useEffect, createContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { pingAuth } from '../../api/IdentityAPI';

const UserContext = createContext<User | null>(null);
interface User {
  email: string; // Stores the email of the user that microsoft will send
  roles: string[]; // Stores the roles of the user
}

function AuthorizeView(props: {
  children?: React.ReactNode;
  allowedRoles?: string[];
}) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // add a loading state

  let emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState(emptyuser); // defaults to not logged in

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedInUser = await pingAuth(); // Uses the pingauth API call

        if (loggedInUser) {
          setUser({ email: loggedInUser.email, roles: loggedInUser.roles }); // If there is an email, it updates the user
          setAuthorized(true); // Tells system the user can use the child components
        } else {
          throw new Error('Invalid user session');
        }
      } catch (error) {
        setAuthorized(false); // If error, they are not authorized
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Run function
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (authorized) {
    if (
      props.allowedRoles &&
      !props.allowedRoles.some((role) => user.roles.includes(role))
    ) {
      return <Navigate to="/unauthorized" />;
    }

    return (
      <UserContext.Provider value={user}>{props.children ? props.children: <Outlet />}</UserContext.Provider>
    );
  }
  //Redirects unauthorized users to the homepage instead of /login
  return <Navigate to="/" />;
}
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null; // Prevents errors if context is null
  return props.value === 'email' ? <>{user.email}</> : null;
}
export default AuthorizeView;
