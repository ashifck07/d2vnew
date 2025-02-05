// import React, { createContext, useContext, useState, useEffect } from "react";
// import {jwtDecode} from "jwt-decode"; // Install with `npm install jwt-decode`

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Fetch user data from session storage
//   useEffect(() => {
//     const token = sessionStorage.getItem("jwt");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser({ id: decoded.id, role: decoded.role }); // Assuming JWT includes `id` and `role`
//       } catch (error) {
//         console.error("Failed to decode token", error);
//       }
//     }
//   }, []);

//   const login = (token) => {
//     sessionStorage.setItem("jwt", token);
//     const decoded = jwtDecode(token);
//     setUser({ id: decoded.uid, role: decoded.role });
//   };

//   const logout = () => {
//     sessionStorage.removeItem("jwt");
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => useContext(UserContext);
import React, {createContext, useContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode"; // Install with npm install jwt-decode

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // Fetch user data from session storage on initial load
  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({id: decoded.uid, role: decoded.role, name: decoded.name}); // Assuming JWT includes `id` and `role`
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem("jwt", token);
    const decoded = jwtDecode(token);
    setUser({id: decoded.uid, role: decoded.role, name: decoded.name});
  };

  const logout = () => {
    sessionStorage.removeItem("jwt");
    setUser(null);
  };

  return <UserContext.Provider value={{user, login, logout}}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
