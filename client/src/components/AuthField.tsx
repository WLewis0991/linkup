import { useState } from "react";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthField({ label, error, className, ...props }: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold tracking-widest"
        style={{ color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={`w-full rounded-xl px-4 py-3 text-base sm:text-sm outline-none transition-all ${className ?? ""}`}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: focused
            ? isDark
              ? "#334155"
              : "#fff"
            : isDark
              ? "#1e293b"
              : "#f8fafc",
          border: error
            ? "1.5px solid #ef4444"
            : "1.5px solid #94a3b8",
          color: isDark ? "#f1f5f9" : "#0f172a",
          ...props.style,
        }}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
