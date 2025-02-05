import React, { useContext } from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom'; // For handling redirects
import {jwtDecode} from 'jwt-decode'; // For decoding JWT to check expiration
import { useUserContext } from '../../context/UserContext';

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const token = sessionStorage.getItem('jwt');

//   // Function to check if the JWT is expired
//   const isTokenExpired = () => {
//     if (!token) return true; // If no token, consider it expired
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000; // Get current time in seconds
//       return decoded.exp < currentTime; // Compare expiry time
//     } catch (e) {
//       return true; // If there's an error decoding, treat the token as expired
//     }
//   };

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         token && !isTokenExpired() ? ( // If token exists and not expired
//           <Component {...props} />
//         ) : (
//           <Navigate to="/login" /> // Redirect to login page if not authenticated
//         )
//       }
//     />
//   );
// };
const ProtectedRoute = ({ children, roles }) => {
  const { user, isLoggedIn } = useContext(useUserContext);
  if (!isLoggedIn) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // If user's role does not match any of the allowed roles
    <Navigate to="/login" />
  }

  return children;
};
export default ProtectedRoute;
