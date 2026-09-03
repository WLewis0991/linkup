import { clearToken } from "./token";
import { disconnectSocket } from "../sockets/socket";

export function logout(): void {
  disconnectSocket();
  clearToken();
}
