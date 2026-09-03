import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../sockets/socket";
import type { Message } from "../types/Types";

interface UseMessagesSocketOptions {
  receiveEvent: string;
  systemEvent: string;
  historyEvent: string;
  leaveEvent: string;
  activeIdRef: React.MutableRefObject<string | null>;
}

export function useMessagesSocket({
  receiveEvent,
  systemEvent,
  historyEvent,
  leaveEvent,
  activeIdRef,
}: UseMessagesSocketOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemMessages, setSystemMessages] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const activeId = activeIdRef.current;

    const messageHandler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const systemHandler = (text: string) => {
      setSystemMessages((prev) => [...prev, text]);
      setTimeout(() => {
        setSystemMessages((prev) => prev.filter((msg) => msg !== text));
      }, 3000);
    };

    const historyHandler = (history: Message[]) => {
      setMessages(history);
    };

    socket.on(receiveEvent, messageHandler);
    socket.on(systemEvent, systemHandler);
    socket.on(historyEvent, historyHandler);

    return () => {
      socket.off(receiveEvent, messageHandler);
      socket.off(systemEvent, systemHandler);
      socket.off(historyEvent, historyHandler);
      if (activeId) socket.emit(leaveEvent, activeId);
    };
  }, [receiveEvent, systemEvent, historyEvent, leaveEvent, activeIdRef]);

  const resetMessages = useCallback(() => setMessages([]), []);

  return { messages, systemMessages, messagesEndRef, resetMessages };
}
