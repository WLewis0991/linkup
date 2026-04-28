import { useState, useEffect } from "react";
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

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim()) return;

    // ONLY send raw text (server attaches user via JWT)
    socket.emit("send_message", input);

    setInput("");
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);

  return (
    <div className="chat-container w-full min-h-dvh p-4 flex flex-col">
      <h2>Chat</h2>

      <div className="messages w-full flex-1 overflow-y-auto mb-4 flex flex-col justify-end gap-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from.username}</strong>: {msg.content}
            <p className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>

      <div className="input-area display flex items-center gap-2 justify-center border-t pt-2">
        <input
          className="w-1/2"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}