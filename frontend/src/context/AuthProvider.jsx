import React, {createContext, useState, useEffect} from "react";
import Cookies from "js-cookie";
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/verify`,
          {
            method: "GET",
            credentials: "include", // Include cookies
          }
        );
        const data = await response.json();
        if (response.ok) {
          setIsAuthenticated(true);
          if (data.data.user) {
            setUserData(data.data.user);
          } else {
            setUserData(data.data.sp);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    if (userData.length <= 0) {
      const token = Cookies.get("accessToken");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      } else {
        verifyUser();
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        setIsAuthenticated,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
