// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load token from localStorage on mount
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     console.log('=== AUTH CONTEXT INIT ===');
//     console.log('Stored token:', storedToken ? 'Exists' : 'None');
//     console.log('Stored user:', storedUser);

//     if (storedToken && storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         console.log('Parsed user:', parsedUser);
//         console.log('User role:', parsedUser.role);
        
//         setToken(storedToken);
//         setUser(parsedUser);
//       } catch (error) {
//         console.error('Error loading auth data:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData, authToken) => {
//     console.log('=== LOGIN CALLED ===');
//     console.log('User data:', userData);
//     console.log('User role:', userData.role);
//     console.log('Token:', authToken);

//     setUser(userData);
//     setToken(authToken);
//     localStorage.setItem('token', authToken);
//     localStorage.setItem('user', JSON.stringify(userData));
    
//     console.log('✅ User logged in successfully');
//   };

//   const logout = () => {
//     console.log('=== LOGOUT CALLED ===');
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('superAdminToken');
//     localStorage.removeItem('adminToken');
//     console.log('✅ User logged out successfully');
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!token,
//     isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
//     isSuperAdmin: user?.role === 'superadmin'
//   };

//   console.log('=== AUTH CONTEXT VALUE ===');
//   console.log('Is Authenticated:', value.isAuthenticated);
//   console.log('Is Admin:', value.isAdmin);
//   console.log('User Role:', user?.role);

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('=== AUTH CONTEXT INIT ===');
    console.log('Stored token:', storedToken ? 'Exists' : 'None');
    console.log('Stored user:', storedUser);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        console.log('User role:', parsedUser.role);
        
        setToken(storedToken);
        setUser(parsedUser);
        
        console.log('✅ Auth state restored from localStorage');
      } catch (error) {
        console.error('❌ Error loading auth data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('⚠️ No stored authentication found');
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    console.log('=== LOGIN CALLED ===');
    console.log('User data:', userData);
    console.log('User role:', userData.role);
    console.log('Token received:', authToken ? 'Yes' : 'No');

    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ User logged in and stored');
  };

  const logout = () => {
    console.log('=== LOGOUT CALLED ===');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('adminToken');
    console.log('✅ User logged out and cleared');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSuperAdmin: user?.role === 'superadmin'
  };

  console.log('=== AUTH CONTEXT VALUE ===');
  console.log('Is Authenticated:', value.isAuthenticated);
  console.log('Is Admin:', value.isAdmin);
  console.log('User Role:', user?.role);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};