import type { Message } from "../types/Types";
import { jwtDecode } from "jwt-decode";

type JwtPayload ={
  username:string;
  id:string;
}

export default function MessageBubble({msg}: {msg: Message}) {

const token = localStorage.getItem("token");
const currentUser = token ? jwtDecode<JwtPayload>(token) : null;

  const isSender = msg.from.username === currentUser?.username;

    return (<>
    <div  className={isSender
          ? "message-bubble flex flex-col bg-blue-500 text-white dark:bg-slate-800 p-2 rounded-lg max-w-md w-fit self-end min-w-0 break-words"
          : "message-bubble flex flex-col bg-gray-200 text-gray-800 p-2 rounded-lg dark:bg-slate-600 dark:text-slate-100 max-w-md w-fit self-start min-w-0 break-words"
      } >
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold">{msg.from.username}</h1>
        <h3 className="text-[10px] text-gray-200">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </h3>
      </div>
      <p className="text-sm leading-snug">{msg.content}</p>
    </div>
    </>)
}