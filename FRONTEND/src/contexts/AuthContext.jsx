import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAuthState({
          isLoggedIn: true,
          user: {
            id: parsedUser.id,
            email: parsedUser.email || parsedUser.username, // Fallback to username if email missing
            first_name: parsedUser.first_name || "",
            last_name: parsedUser.last_name || "",
            role: parsedUser.role || "STUDENT", // Default to STUDENT if missing
            student_number: parsedUser.student_number,
            token: token,
          }
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        logout();
      }
    }
  }, []);

  const login = (responseData) => {
    if (!responseData || !responseData.token || !responseData.user) {
      console.error("Invalid login response:", responseData);
      return;
    }

    const userToStore = {
      id: responseData.user.id,
      email: responseData.user.email || responseData.user.username, // Use email or fallback to username
      first_name: responseData.user.first_name || "",
      last_name: responseData.user.last_name || "",
      role: responseData.user.role || "STUDENT", // Default role
      student_number: responseData.user.student_number,
      lecturer_number: responseData.user.lecturer_number,
      registrar_number: responseData.user.registrar_number,
      token: responseData.token,
    };

    localStorage.setItem("authToken", responseData.token);
    localStorage.setItem("userData", JSON.stringify(userToStore));

    setAuthState({
      isLoggedIn: true,
      user: userToStore,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setAuthState({
      isLoggedIn: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        user: authState.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}