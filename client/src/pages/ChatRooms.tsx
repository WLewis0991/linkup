import { useState, useEffect } from "react"
import { api } from "../api/axios"
import { Link } from "react-router";

interface ChatRooms {
    id: string;
    name: string;
    description?: string;
}

export default function ChatRooms() {

    const [rooms, setRooms] = useState<ChatRooms[]>([])

    const fetchRooms = async () => {
        try{
            const res = await api.get("api/rooms/my-rooms");
            setRooms(res.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }

    useEffect(() => {
        fetchRooms();
    })

    return ( <>
        <div className="bg-zinc-100 dark:bg-slate-950 dark:text-slate-100 dark:bg-opacity-10 p-10 w-full h-full">
            <h1 className="text-2xl font-bold mb-6">My Chat Rooms</h1>
            {rooms.length === 0 ? (
                <p>You are not a member of any chat rooms yet.</p>
            ) : (
                <ul className="space-y-4">
                    {rooms.map((room) => (
                        <li key={room.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{room.name}</h2>
                            {room.description && <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{room.description}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>  
    
    </>)
}