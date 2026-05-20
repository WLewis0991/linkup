import { useState, useEffect } from "react"
import { api } from "../api/axios"
import DMCard from "../components/DMCard"
import { useCurrentUser } from "../hooks/useCurrentUser" // adjust path

type ConversationPreview = {
  id: string
  participants: { user: { id: string; username: string; avatar: string | null } }[]
  messages: { content: string; createdAt: string }[]
}

export default function Messages() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const user = useCurrentUser()

  useEffect(() => {
    api.get("/api/dms/my-dms")
      .then(res => setConversations(res.data))
      .catch(err => console.error("Error fetching DMs:", err))
  }, [])

  if (!user) return null

  return (
    <div className="bg-zinc-100 dark:bg-slate-950 dark:text-slate-100 dark:bg-opacity-10 p-10 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">My DMs</h1>
      {conversations.length === 0 ? (
        <p>You have no DMs yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conversation) => (
            <DMCard key={conversation.id} conversation={conversation} />
          ))}
        </ul>
      )}
    </div>
  )
}