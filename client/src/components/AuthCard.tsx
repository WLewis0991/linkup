import { useEffect, useState } from "react";

interface AuthCardProps {
  title?: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  const isDark = document.documentElement.classList.contains("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "0.4s",
      }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark
              ? "rgba(15,23,42,0.80)"
              : "rgba(255,255,255,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: isDark
              ? "1px solid rgba(71,85,105,0.5)"
              : "1px solid rgba(255,255,255,0.9)",
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.40), 0 1px 2px rgba(0,0,0,0.20)"
              : "0 8px 40px rgba(15,23,42,0.10), 0 1px 2px rgba(15,23,42,0.06)",
          }}
        >
          {title && (
            <h1 className="text-center font-bold text-lg pt-6 dark:text-white text-slate-900">
              {title}
            </h1>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
