import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(): Promise<Socket> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, user must login");
  }

  // reuse existing connection
  if (socket?.connected) {
    return Promise.resolve(socket);
  }

  socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
    auth: { token },
    transports: ["websocket"],
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Socket connection timeout"));
    }, 10000);

    socket!.on("connect", () => {
      clearTimeout(timeout);
      console.log("socket connected:", socket!.id);
      resolve(socket!);
    });

    socket!.on("connect_error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    socket!.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
    });
  });
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}