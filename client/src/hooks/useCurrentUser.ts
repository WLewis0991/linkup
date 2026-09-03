import { useMemo } from "react";
import { getToken, decodeToken } from "../auth/token";

export function useCurrentUser() {
  const token = getToken();

  const user = useMemo(() => {
    if (!token) return null;
    return decodeToken(token);
  }, [token]);

  return user;
}
