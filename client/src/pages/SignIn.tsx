import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/axios";
import { connectSocket } from "../sockets/socket";
import { AuthField } from "../components/AuthField";
import { AuthCard } from "../components/AuthCard";
import axios from "axios";

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

export default function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [error, setError] = useState("");

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

      if (data.token) {
        await localStorage.setItem("token", data.token);
        await connectSocket();
        await navigate("/home");
      } else {
        setError("No token returned");
      }
    } catch (err) {
      const error = err as Error;
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <form
        onSubmit={handleSubmit}
        className="dark:bg-slate-900 dark:text-white flex flex-col gap-4 p-5"
      >
        <AuthField
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
            className="dark:bg-slate-800 dark:border-slate-400 dark:hover:border-slate-400 dark:focus:bg-slate-700 w-full rounded-xl px-4 py-3 pr-10 border border-zinc-200 focus:border-slate-400 outline-none transition-all"
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

      <p className="dark:text-slate-300 text-center text-sm mt-4 pb-4">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </AuthCard>
  );
}
