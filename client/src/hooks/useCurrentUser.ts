import { useMemo } from "react";

function parseJwt(token: string) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function useCurrentUser() {
  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    if (!token) return null;
    return parseJwt(token);
  }, [token]);

  return user; // has whatever fields are in your JWT payload e.g. user.id, user.sub
}