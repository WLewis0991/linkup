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
    <div className="chat-container">
      <h2>Chat</h2>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from.username}</strong>: {msg.content}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
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