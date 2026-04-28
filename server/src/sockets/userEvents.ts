import { Server as SocketIOServer, Socket } from "socket.io";

export function registerUserEvents(io: SocketIOServer, socket: Socket){
    socket.on("testSocket", (data) => {
        socket.emit("testSocket", {msg:"It's working! parte 2"});
    })
}