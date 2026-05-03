import { api } from "../api/axios";
import { useEffect, useState } from "react";
import UserCard from "../components/UserCards";

interface UserCardProps {
  user: {
    id: string
    avatar?: string | null
    username: string
  }
}

export default function People() {

    const [users, setUsers] = useState<UserCardProps['user'][]>([])

    const fetchUsers = async () => {
        try{
            const res = await api.get("/api/user");
            setUsers(res.data);
        } catch (err:any) {
            console.error("Failed to fetch users:", err.response?.data || err.message); 
        }

    }

    useEffect(() => {
        fetchUsers()
    })
 
    return (
        <div className="bg-zinc-100 dark:bg-slate-950 dark:text-slate-100 dark:bg-opacity-10 p-10 w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
            <UserCard key={user.id} user={user} />
            ))}
        </div>
        </div>
    )

}