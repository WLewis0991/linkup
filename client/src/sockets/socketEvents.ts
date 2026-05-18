import { getSocket } from "./socket";

export function testSocket(payload: any, off: boolean = false) {
  const socket = getSocket();
  if (!socket) {
    console.log("socket is not connected");
    return;
  }

  if (off) {
    //turn off listening to this event
    socket.off("testSocket", payload);
  } else if (typeof payload == "function") {
    socket.on("testSocket", payload); //callback
  } else {
    socket.emit("testSocket", payload);
  }
}
