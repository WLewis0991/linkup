import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/axios";
import { connectSocket } from "../sockets/socket";
import axios from "axios";
import { AuthField } from "../components/AuthField";
import { AuthCard } from "../components/AuthCard";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    email?: string;
    confirm?: string;
  }>({});
  const [error, setError] = useState("");

  const validate = () => {
    const e: typeof errors = {};
    if (!username) e.username = "Username is required";
    if (!password) e.password = "Password is required";
    if (!email) e.email = "Email is required";
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
      const data = await register(username, password, email);

      if (data.token) {
        localStorage.setItem("token", data.token);
        await connectSocket();
        navigate("/home");
      } else {
        navigate("/sign-in");
      }
    } catch (err) {
      const error = err as Error;
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
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
        <AuthField
          label="EMAIL"
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((x) => ({ ...x, email: undefined }));
          }}
          error={errors.email}
        />
        <AuthField
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
        <AuthField
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

      <p className="dark:text-slate-300 text-center text-sm mt-4 pb-4">
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </AuthCard>
  );
}
