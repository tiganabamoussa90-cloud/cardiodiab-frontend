import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { registerUnauthorizedHandler } from "../services/axiosClient";

export const AuthContext = createContext(null);

const STORAGE_KEY = "cardiodiab_session";
const TOKEN_KEY = "cardiodiab_token";

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // No real "verify token" endpoint is exposed, so we trust the stored
    // session until a request comes back 401 — handled below.
    setIsBooting(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(logout);
  }, [logout]);

  const login = useCallback(async (email, motDePasse) => {
    const data = await authService.login(email, motDePasse);
    const nextSession = {
      role: data.role,
      userId: data.user_id,
    };
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }, []);

  const value = useMemo(
    () => ({
      session,
      role: session?.role ?? null,
      userId: session?.userId ?? null,
      isAuthenticated: Boolean(session),
      isBooting,
      login,
      logout,
    }),
    [session, isBooting, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
