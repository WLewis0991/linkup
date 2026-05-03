import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useDarkMode } from "../hooks/LightButton";
import { Avatar } from "../components/Avatar";

type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
};

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const isDark = useDarkMode();
  
  

  useEffect(() => {
    if (!id) return;
    api.get(`/api/user/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user:", err));
  }, [id]);

  if (!user) return <LoadingSpinner />;

  
  return (
    
    <div className="h-full overflow-y-auto px-6 py-10 dark:text-slate-100 bg-zinc-100 dark:bg-slate-950 dark:bg-opacity-10 text-slate-800">
      <div className="max-w-xl mx-auto flex flex-col gap-6">

        {/* Avatar + username hero */}
        <div
          className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
          style={{
            background: isDark ? "rgba(15,23,42,0.10)" : "rgba(255,255,255,0.65)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: isDark ? "1px solid rgba(71,85,105,0.45)" : "1px solid rgba(255,255,255,0.9)",
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.35)"
              : "0 8px 40px rgba(15,23,42,0.08)",
          }}
        >
          {/* Avatar */}
          <Avatar avatarUrl={user.avatar} name={user.username} className="min-h-30 min-w-30 rounded-full"/>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
            <p className="text-sm mt-1 dark:text-slate-400 text-slate-500">{user.email}</p>
          </div>

          {/* Bio placeholder — replace with real bio field when ready */}
          <p className="text-sm dark:text-slate-500 text-slate-400 italic max-w-xs">
            No bio yet.
          </p>
        </div>

        {/* Details card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark ? "rgba(15,23,42,0.10)" : "rgba(255,255,255,0.65)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: isDark ? "1px solid rgba(71,85,105,0.35)" : "1px solid rgba(255,255,255,0.9)",
            boxShadow: isDark
              ? "0 4px 24px rgba(0,0,0,0.25)"
              : "0 4px 24px rgba(15,23,42,0.06)",
          }}
        >
          {[
            { label: "Username", value: user.username },
            { label: "Email", value: user.email },
            { label: "User ID", value: user.id },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between px-6 py-4 ${
                i < arr.length - 1
                  ? "border-b dark:border-slate-700/50 border-slate-200/80"
                  : ""
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-widest dark:text-slate-500 text-slate-400">
                {label}
              </span>
              <span className="text-sm font-medium dark:text-slate-200 text-slate-700 truncate max-w-[60%] text-right">
                {value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}