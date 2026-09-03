import { jwtDecode } from "jwt-decode";

export type AuthUser = {
  userId: string;
  username: string;
};

const TOKEN_KEY = "token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<AuthUser & { exp?: number }>(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    if (!decoded?.userId) {
      return null;
    }

    return { userId: decoded.userId, username: decoded.username };
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
