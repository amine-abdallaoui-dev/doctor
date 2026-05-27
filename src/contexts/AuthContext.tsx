import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type UserRole = "patient" | "doctor" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, User> = {
  "patient@demo.com": { id: 1, name: "John Doe", email: "patient@demo.com", role: "patient" },
  "doctor@demo.com": { id: 2, name: "Dr. James Wilson", email: "doctor@demo.com", role: "doctor" },
  "admin@demo.com": { id: 3, name: "Admin User", email: "admin@demo.com", role: "admin" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("medibook_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string, role?: UserRole) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser) {
      const finalUser = role && role !== demoUser.role
        ? { ...demoUser, role }
        : demoUser;
      setUser(finalUser);
      localStorage.setItem("medibook_user", JSON.stringify(finalUser));
      return true;
    }

    // Allow any email to login as patient by default
    const newUser: User = {
      id: Date.now(),
      name: email.split("@")[0],
      email: email.toLowerCase(),
      role: role || "patient",
    };
    setUser(newUser);
    localStorage.setItem("medibook_user", JSON.stringify(newUser));
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    const newUser: User = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      role,
    };
    setUser(newUser);
    localStorage.setItem("medibook_user", JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("medibook_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export type { UserRole };
