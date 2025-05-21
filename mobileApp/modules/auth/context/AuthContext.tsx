import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/auth';

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
