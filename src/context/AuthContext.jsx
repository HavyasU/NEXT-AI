import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
const AuthContext = React.createContext("");

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialiseUser = async (user) => {
    if (user) {
      setUserLoggedIn(true);
      setCurrentUser({ ...user });
      setCurrentUser(user?.uid);
    } else {
      setUserLoggedIn(false);
      setCurrentUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    onAuthStateChanged(auth, initialiseUser);
  }, []);

  const value = { userLoggedIn, loading, currentUser };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
