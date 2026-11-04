import { apiRequest } from "./api";

type AuthResponse = { user: AuthUser };

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export function logout() {
  return apiRequest<{ message: string }>("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<AuthUser | null> {
  const result = await apiRequest<AuthResponse>("/auth/me");
  return result.ok ? result.data.user : null;
}
