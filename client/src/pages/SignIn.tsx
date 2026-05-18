import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/axios";
import { connectSocket, getSocket } from "../sockets/socket";

// ── Reusable input component ──────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Field({
  label,
  error,
  className,
  ...props
}: InputProps & { className?: string }) {
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
        className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all ${className ?? ""}`}
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
            : focused
              ? "1.5px solid #94a3b8"
              : "1.5px solid #94a3b8",
          color: isDark ? "#f1f5f9" : "#0f172a",
          ...props.style,
        }}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Eye toggle icon ───────────────────────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SignIn() {
  const navigate = useNavigate();

  const isDark = document.documentElement.classList.contains("dark");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [error, setError] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (!username) e.username = "Username is required";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setError("");
    setLoading(true);

    try {
      const data = await login(username, password);
      const socket = getSocket();

      if (data.token) {
        await localStorage.setItem("token", data.token);
        await connectSocket();
        socket?.emit("join_room", "global");
        await navigate("/home");
      } else {
        setError("No token returned");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className=" min-h-screen flex items-center justify-center px-4"
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
          <form
            onSubmit={handleSubmit}
            className="dark:bg-slate-900  dark:text-white flex flex-col gap-4 p-5"
          >
            <Field
              label="USERNAME"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((x) => ({ ...x, username: undefined }));
              }}
              error={errors.username}
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((x) => ({ ...x, password: undefined }));
                }}
                className="dark:bg-slate-800 dark:border-slate-400 dark:hover:border-slate-400 dark:focus:bg-slate-700  w-full rounded-xl px-4 py-3 pr-10 border border-zinc-200 focus:border-slate-400 outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeIcon open={showPass} />
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-xl bg-slate-800 text-white"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="dark:text-slate-300 text-center text-sm mt-4">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
