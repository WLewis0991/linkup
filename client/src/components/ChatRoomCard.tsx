import { Link } from "react-router-dom";

export default function ChatRoomCard({
  room,
}: {
  room: { id: string; name: string; description?: string };
}) {
  return (
    <Link
      to={`/home/chat/${room.id}`}
      state={{ name: room.name }}
      className="block"
    >
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border dark:bg-opacity-10 border-gray-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 cursor-pointer">
        <h2 className="text-xl font-semibold">{room.name}</h2>
        {room.description && (
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            {room.description}
          </p>
        )}
      </div>
    </Link>
  );
}
