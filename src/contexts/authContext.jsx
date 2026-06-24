import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUserByPhone } from "../services/firebase/firestore/userService.js";
import { Loader } from "../components";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
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

            const firestoreUser = await getUserByPhone(user.phoneNumber.slice(3)); // Remove country code
            setUserData(firestoreUser);

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
