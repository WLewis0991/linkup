import { useState, useEffect, useCallback, useRef } from "react";
import { getSocket } from "../sockets/socket";
import type { Message } from "../types/Types";
import MessageBubble from "./MessageBubble";
import { useLocation } from "react-router-dom";

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [systemMessages, setSystemMessages] = useState<string[]>([]);

  const state = useLocation().state as { name: string } | null;

  const currentRoomRef = useRef(currentRoom);
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  const joinRoom = useCallback((newRoom: string) => {
    const socket = getSocket();
    if (!socket) return;
    if (currentRoomRef.current) {
      socket.emit("leave_room", currentRoomRef.current);
    }
    setMessages([]);
    setCurrentRoom(newRoom);
    socket.emit("join_room", newRoom);
  }, []);

  useEffect(() => {
    if (state?.name) {
      joinRoom(state.name);
    }
  }, [state, joinRoom]);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim() || !currentRoom) return;

    socket.emit("send_message", { text: input, room: currentRoom });
    setInput("");
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

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
    socket.on("message_history", (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socket.off("receive_message", messageHandler);
      socket.off("system_message", systemHandler);
      if (currentRoomRef.current)
        socket.emit("leave_room", currentRoomRef.current);
    };
  }, []);

  return (
    <div className="dark:bg-slate-950 dark:text-white bg-zinc-100 w-full h-full p-4 flex flex-col min-h-0 dark:bg-opacity-10">
      <h2>Room: {currentRoom ?? "None"}</h2>

      <div className="message-box w-full flex-1 min-h-0 mb-4 flex flex-col gap-2 overflow-y-auto">
        <div className="mt-auto" />
        {messages.map((msg, index) => (
          <MessageBubble msg={msg} key={index} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col items-center">
        {systemMessages.map((text, index) => (
          <div key={index} className="text-center text-gray-400 text-sm italic">
            {text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 justify-center border-zinc-200 dark:border-slate-800 border-t pt-2">
        <input
          className="w-1/2 dark:bg-slate-900 dark:text-white p-2 rounded dark:bg-opacity-10"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!currentRoom}
          className="dark:bg-slate-900 dark:text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
