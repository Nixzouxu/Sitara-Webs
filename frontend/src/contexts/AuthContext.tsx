import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  healthData?: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  quickStart: (name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi cek auth dari localStorage
    const savedUser = localStorage.getItem("sitara_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulasi validasi - untuk demo, terima email apapun dengan password "password"
    if (password === "password") {
      const mockUser = {
        id: "1",
        name: email.split("@")[0],
        email: email,
        dateOfBirth: "1990-01-01"
      };
      
      setUser(mockUser);
      localStorage.setItem("sitara_user", JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      dateOfBirth: data.dateOfBirth
    };
    
    setUser(newUser);
    localStorage.setItem("sitara_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const quickStart = async (name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@sitara.app`,
      dateOfBirth: new Date().toISOString().split('T')[0]
    };
    
    setUser(newUser);
    localStorage.setItem("sitara_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sitara_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, quickStart, logout, isLoading }}>
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