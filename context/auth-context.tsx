"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = Cookies.get("hrms_token");
    const storedUser = Cookies.get("hrms_user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Invalid user data
        Cookies.remove("hrms_token");
        Cookies.remove("hrms_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual API endpoint
      // const response = await axios.post("/api/auth/login", { email, password });
      
      // Demo login for frontend showcase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === "admin@hrms.com" && password === "admin123") {
        const mockUser = {
          id: "1",
          email: "admin@hrms.com",
          name: "Admin User",
          role: "admin"
        };
        const mockToken = "mock_jwt_token_" + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        
        Cookies.set("hrms_token", mockToken, { expires: 7 });
        Cookies.set("hrms_user", JSON.stringify(mockUser), { expires: 7 });
        
        router.push("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("hrms_token");
    Cookies.remove("hrms_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
