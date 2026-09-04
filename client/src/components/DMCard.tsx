import { Link } from "react-router-dom"

type ConversationPreview = {
  id: string
  participants: { user: { id: string; username: string; avatar: string | null } }[]
  messages: { content: string; createdAt: string }[]
}

export default function DMCard({ conversation}: { conversation: ConversationPreview, }) {
  const other = conversation.participants[0].user
  const latestMessage = conversation.messages[0]

  return (
    <Link to={`/home/dm/${other.id}`} state={{ conversationId: conversation.id, username: other.username, avatar: other.avatar }}>
      <div className="flex items-center gap-3 p-4 mt-3 rounded-lg bg-white dark:bg-slate-950 dark:border dark:border-slate-00">
        <img src={other.avatar ?? "/default-avatar.png"} className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{other.username}</p>
          {latestMessage && (
            <p className="text-sm text-gray-400 truncate">{latestMessage.content}</p>
          )}
        </div>
      </div>
    </Link>
  )
}