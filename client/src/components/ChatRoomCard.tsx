import { Link } from "react-router-dom";

export default function ChatRoomCard({ room }: { room: { id: string; name: string; description?: string } }) {
    
    return (
        <Link to={`/home/chat/${room.id}`} state={{name: room.name}} className="block" >
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <h2 className="text-xl font-semibold">{room.name}</h2>
                {room.description && <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{room.description}</p>}
            </div>
        </Link>
    );
}