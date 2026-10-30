import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState("");

  useEffect(() => {
    api.me()
      .then((result) => {
        setUser(result.user || null);
        setInitializationError("");
      })
      .catch((error) => setInitializationError(error.message))
      .finally(() => setInitialized(true));
    function onUnauthorized() {
      setUser(null);
      setInitializationError("Your session expired. Please log in again.");
    }
    window.addEventListener("algovista:unauthorized", onUnauthorized);
    return () => window.removeEventListener("algovista:unauthorized", onUnauthorized);
  }, []);

  const value = useMemo(() => ({
    user,
    initialized,
    initializationError,
    setUser(nextUser) {
      setUser(nextUser);
      setInitializationError("");
    },
    async refresh() {
      try {
        const result = await api.me();
        setUser(result.user || null);
        setInitializationError("");
        return result.user;
      } catch (error) {
        setInitializationError(error.message);
        throw error;
      }
    },
    async logout() {
      await api.logout();
      setUser(null);
    },
  }), [user, initialized, initializationError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
