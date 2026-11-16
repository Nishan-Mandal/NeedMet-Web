import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUserByPhone } from "../services/firebase/firestore/userService.js";
import { Loader } from "../components";

const defaultAuthContextValue = {
  currentUser: null,
  userData: null,
  userLoggedIn: false,
  loading: true,
  logout: async () => {},
};

const AuthContext = createContext(defaultAuthContextValue);

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContextValue;
}

const logout = async () => {
  try {
    await signOut(auth);

  } catch(error) {
    console.error(error);
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            setCurrentUser(user);

            if (user.phoneNumber) {
              const phoneClean = user.phoneNumber.startsWith("+91")
                ? user.phoneNumber.slice(3)
                : user.phoneNumber.replace(/[^\d]/g, '').slice(-10);
              const firestoreUser = await getUserByPhone(phoneClean);
              setUserData(firestoreUser);
            }
          } else {
            setCurrentUser(null);
            setUserData(null);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    userLoggedIn: !!currentUser,
    loading,
    logout,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default useAuth;
