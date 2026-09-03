import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../sockets/socket";
import MessageBubble from "./MessageBubble";
import { useParams, useLocation } from "react-router-dom";
import { useMessagesSocket } from "../hooks/useMessagesSocket";

export default function DmContainer() {
  const [input, setInput] = useState("");
  const [currentRecipient, setCurrentRecipient] = useState<string | null>(null);

  const { id } = useParams();
  const { state } = useLocation();
  const username = state?.username ?? id;

  const currentRecipientRef = useRef(currentRecipient);
  useEffect(() => {
    currentRecipientRef.current = currentRecipient;
  }, [currentRecipient]);

  const { messages, systemMessages, messagesEndRef, resetMessages } = useMessagesSocket({
    receiveEvent: "receive_dm",
    systemEvent: "dm_system_message",
    historyEvent: "dm_history",
    leaveEvent: "leave_dm",
    activeIdRef: currentRecipientRef as React.MutableRefObject<string | null>,
  });

  const joinDm = useCallback((recipientId: string) => {
    const socket = getSocket();
    if (!socket) return;
    if (currentRecipientRef.current) {
      socket.emit("leave_dm", currentRecipientRef.current);
    }
    resetMessages();
    setCurrentRecipient(recipientId);
    socket.emit("join_dm", recipientId);
  }, [resetMessages]);

  useEffect(() => {
    if (id) {
      // Joining a DM room is an imperative side-effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      joinDm(id);
    }
  }, [id, joinDm]);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim() || !currentRecipient) return;

    socket.emit("send_dm", { text: input, recipientId: currentRecipient });
    setInput("");
  };

  return (
    <div className="dark:bg-slate-950 dark:text-white bg-zinc-100 w-full h-full p-4 flex flex-col min-h-0 dark:bg-opacity-10">
      <h2>DM: {username ?? "None"}</h2>

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
          disabled={!currentRecipient}
          className="dark:bg-slate-900 dark:text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
