"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import type { FieldErrors } from "@/types/api";
import * as authService from "@/utils/authService";

export type AuthActionResult = { error?: string; fieldErrors?: FieldErrors };

type AuthContextState = {
  user: AuthUser | null;
  isPending: boolean;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (email: string, password: string) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  // Frågar backend vem som är inloggad. Cookien skickas med automatiskt.
  const refreshUser = useCallback(async () => {
    setIsPending(true);
    const me = await authService.getMe();
    setUser(me);
    setIsPending(false);
  }, []);

  // Körs när appen laddas, så att inloggningen finns kvar efter omladdning (G2).
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  async function login(email: string, password: string): Promise<AuthActionResult> {
    const result = await authService.login(email, password);
    if (!result.ok) {
      return { error: result.message, fieldErrors: result.fieldErrors };
    }
    setUser(result.data.user);
    return {};
  }

  async function register(email: string, password: string): Promise<AuthActionResult> {
    const result = await authService.register(email, password);
    if (!result.ok) {
      return { error: result.message, fieldErrors: result.fieldErrors };
    }
    setUser(result.data.user);
    return {};
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isPending, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
