import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/axios";
import { connectSocket } from "../sockets/socket";
import axios from "axios";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Field({ label, error, ...props }: InputProps) {
  const isDark = document.documentElement.classList.contains("dark");
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest text-slate-400">
        {label}
      </label>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: focused
            ? (isDark ? "#334155" : "#fff")
            : (isDark ? "#1e293b" : "#f8fafc"),
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

export default function Register() {
  const navigate = useNavigate();
  const isDark = document.documentElement.classList.contains("dark");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirm?: string;
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
    if (password.length < 6) e.password = "Min 6 characters";
    if (confirm !== password) e.confirm = "Passwords do not match";
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
      const data = await register(username, password);

      if (data.token) {
        localStorage.setItem("token", data.token);

        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const userId = payload.id ?? payload._id ?? payload.sub;

        await connectSocket();
        await axios.post(
          `http://localhost:3000/api/rooms/Test%20Room/join`,
          { userId },
          { headers: { Authorization: `Bearer ${data.token}` } }
        );
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="dark:bg-slate-950 min-h-screen flex items-center justify-center px-4"
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
            background: isDark ? "rgba(15,23,42,0.80)" : "rgba(255,255,255,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(255,255,255,0.9)",
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.40), 0 1px 2px rgba(0,0,0,0.20)"
              : "0 8px 40px rgba(15,23,42,0.10), 0 1px 2px rgba(15,23,42,0.06)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
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
            <Field
              label="PASSWORD"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((x) => ({ ...x, password: undefined }));
              }}
              error={errors.password}
            />
            <Field
              label="CONFIRM PASSWORD"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors((x) => ({ ...x, confirm: undefined }));
              }}
              error={errors.confirm}
            />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-xl bg-slate-800 text-white"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
        <p className="dark:text-slate-300 text-center text-sm mt-4">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  );
}