import { getCurrentUser } from "../auth/token";
import { Avatar } from "./Avatar";

type Message = {
  from: {
    username: string;
    avatar?: string | null;
  };
  content: string;
  timestamp: string | Date;
};

export default function MessageBubble({ msg }: { msg: Message }) {
  const currentUser = getCurrentUser();

  const isSender = msg.from.username === currentUser?.username;

  return (
    <>
      <div
        className={
          isSender
            ? "message-bubble flex flex-row-reverse gap-2 sm:gap-5 bg-blue-500 text-white dark:bg-slate-800 p-2 rounded-lg max-w-[85%] sm:max-w-md w-fit self-end min-w-0 break-words"
            : "message-bubble flex flex-row gap-2 sm:gap-5 bg-gray-200 text-gray-800 p-2 rounded-lg dark:bg-slate-600 dark:text-slate-100 max-w-[85%] sm:max-w-md w-fit self-start min-w-0 break-words"
        }
      >
        <Avatar
          avatarUrl={msg.from.avatar}
          className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex-shrink-0"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold">{msg.from.username}</h1>
            <h3 className="text-[10px] text-gray-200">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </h3>
          </div>
          <p className="text-sm leading-snug">{msg.content}</p>
        </div>
      </div>
    </>
  );
}
