import { api } from "../api/axios";
import { useEffect, useState } from "react";


export default function People() {

    const [users, setUsers] = useState([])

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
        <div>
            <h1>People</h1>
            <ul>
                {users.map((user: any) => (
                    <li key={user.id}>
                        <strong>{user.username}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    )

}