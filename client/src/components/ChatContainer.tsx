import { useState, useEffect, useCallback } from "react";
import { getSocket } from "../sockets/socket";

type Message = {
  content: string;
  from: {
    id: string;
    username: string;
  };
  timestamp: string;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState<string | null>("global");
  const [systemMessages, setSystemMessages] = useState<string[]>([]);

  

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim() || !currentRoom) return;

    socket.emit("send_message", { text: input, room: currentRoom });
    setInput("");
  };

  const joinRoom = useCallback((newRoom: string) => {
    const socket = getSocket();
    if (!socket) return;
    if (currentRoom) {
      socket.emit("leave_room", currentRoom);
    }
    setMessages([]);
    setCurrentRoom(newRoom);
    socket.emit("join_room", newRoom);
  }, [currentRoom]); // ✅ depends on currentRoom

useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  // Join the default room on mount
  socket.emit("join_room", "global");

  const messageHandler = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const systemHandler = (text: string) => {
    setSystemMessages((prev) => [...prev, text]);
    setTimeout(() => {
      setSystemMessages((prev) => prev.filter((msg) => msg !== text));
    }, 3000);
  };

  socket.on("receive_message", messageHandler);
  socket.on("system_message", systemHandler);

  return () => {
    socket.off("receive_message", messageHandler);
    socket.off("system_message", systemHandler);
    socket.emit("leave_room", "global"); // clean up on unmount
  };
}, []);



  return (
    <div className="chat-container dark:bg-slate-900 dark:text-white w-full min-h-dvh p-4 flex flex-col">
      <h2>Room: {currentRoom ?? "None"}</h2>

      <div className="messages w-full flex-1 overflow-y-auto mb-4 flex flex-col justify-end gap-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from.username}</strong>: {msg.content}
            <p className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
        {systemMessages.map((text, index) => (
      <div key={index} className="text-center text-gray-400 text-sm italic">
          {text}
        </div>
      ))}

      <div className="input-area display flex items-center gap-2 justify-center border-t pt-2">
        <input
          className="w-1/2 dark:bg-slate-700 dark:text-white p-2 rounded"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage} disabled={!currentRoom} className="dark:bg-slate-700 dark:text-white p-2 rounded">
          Send
        </button> {/*disabled until in a room */}
        <button onClick={() => joinRoom("global")} className="dark:bg-slate-700 dark:text-white p-2 rounded">
          Join Room
        </button>
      </div>
    </div>
  );
}