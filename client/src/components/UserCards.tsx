import { Avatar } from "./Avatar"
import { Link } from "react-router-dom";

interface UserCardProps {
  user: {
    id: string
    avatar?: string | null
    username: string
  }
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link to={`/home/profile/${user.id}`} className="block">
      <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 cursor-pointer">
        <Avatar avatarUrl={user.avatar} name={user.username} className="w-11 h-11 rounded-full flex-shrink-0" />
        <p className="font-medium text-gray-900 dark:text-slate-100 truncate">{user.username}</p>
      </div>
    </Link>
  )
}