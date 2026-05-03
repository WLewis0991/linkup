import { useState, useEffect } from "react"
import { api } from "../api/axios"
import ChatRoomCard from "../components/ChatRoomCard";

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
                        < ChatRoomCard key={room.id} room={room} />
                    ))}
                </ul>
            )}
        </div>  
    
    </>)
}