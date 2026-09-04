import { api } from "../api/axios";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCards";

interface UserCardProps {
  user: {
    id: string;
    avatar?: string | null;
    username: string;
  };
}

export default function People() {
  const [users, setUsers] = useState<UserCardProps["user"][]>([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/user");
      setUsers(res.data);
    } catch (err) {
      const error = err as Error;
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch users:", error.response?.data || error.message);
      } else {
        console.error("Failed to fetch users:", error.message);
      }
    }
  };

  useEffect(() => {
    // Initial data fetch is an external subscription-style side effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  return (
    <div className="h-full overflow-y-auto px-6 py-10 dark:text-slate-100 bg-zinc-100 dark:bg-slate-950 dark:bg-opacity-10 text-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
