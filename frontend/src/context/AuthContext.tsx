import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthResponse, UserRole } from "../types/auth";

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  name: string | null;
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null
  );

  const [name, setName] = useState<string | null>(
    localStorage.getItem("name")
  );

  const login = (authData: AuthResponse) => {
    const fullName =
      `${authData.firstName} ${authData.lastName}`;

    localStorage.setItem("token", authData.token);
    localStorage.setItem("role", authData.role);
    localStorage.setItem("name", fullName);

    setToken(authData.token);
    setRole(authData.role);
    setName(fullName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        name,
        isAuthenticated: Boolean(token),
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
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}