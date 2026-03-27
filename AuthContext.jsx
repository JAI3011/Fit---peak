import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate auth state from localStorage on mount
    const storedUser = localStorage.getItem('fitpeak_user');
    const storedToken = localStorage.getItem('fitpeak_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('fitpeak_user');
        localStorage.removeItem('fitpeak_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role, existingUser = null) => {
    // Simulate backend API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let authUser;
        if (existingUser) {
          authUser = {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            name: existingUser.name,
          };
        } else {
          // Use a stable ID for the default mock trainer
          const isDefaultTrainer = email === 'jane@fitpeak.com';
          authUser = {
            id: isDefaultTrainer ? '2' : Date.now().toString(),
            email,
            role,
            name: email.split('@')[0] || (role === 'trainer' ? 'Rahul Sharma' : 'Jaysmin Patel'),
          };
        }
        
        const mockToken = `fitpeak-token-${Date.now()}`;
        
        setUser(authUser);
        setToken(mockToken);
        
        localStorage.setItem('fitpeak_user', JSON.stringify(authUser));
        localStorage.setItem('fitpeak_token', mockToken);
        
        resolve(authUser);
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fitpeak_user');
    localStorage.removeItem('fitpeak_token');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        role: user?.role, 
        isAuthenticated: !!token, 
        login, 
        logout 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
