import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { api } from "../api/axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useDarkMode } from "../hooks/LightButton";
import { Avatar } from "../components/Avatar";
import { supabase } from "../supabseClient";

type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_MB = 2;
const BIO_MAX = 280;

function parseJwt(token: string) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const isDark = useDarkMode();

  const token = localStorage.getItem("token");
  const currentUser = useMemo(() => (token ? parseJwt(token) : null), [token]);
  const isOwnProfile = currentUser?.userId === user?.id;

  // Avatar upload state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Bio edit state
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [bioSaving, setBioSaving] = useState(false);
  const [bioError, setBioError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/user/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user:", err));
  }, [id]);

  // ── Avatar helpers ──────────────────────────────────────────────
  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type))
      return "Please upload a JPEG, PNG, GIF, or WebP image.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      return `File must be under ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setUploadError(err); return; }
    setUploadError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !isOwnProfile) return;
    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await api.patch(`/api/user/${user.id}`, { avatar: data.publicUrl });
      setUser((prev) => prev ? { ...prev, avatar: data.publicUrl } : prev);
      closeAvatarDialog();
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const closeAvatarDialog = () => {
    setDialogOpen(false);
    setPreview(null);
    setSelectedFile(null);
    setUploadError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Bio helpers ─────────────────────────────────────────────────
  const openBioDialog = () => {
    if (!isOwnProfile) return;
    setBioInput(user?.bio ?? "");
    setBioError("");
    setBioDialogOpen(true);
  };

  const closeBioDialog = () => {
    setBioDialogOpen(false);
    setBioInput("");
    setBioError("");
  };

  const handleBioSave = async () => {
    if (!user || !isOwnProfile) return;
    if (bioInput.length > BIO_MAX) {
      setBioError(`Bio must be ${BIO_MAX} characters or fewer.`);
      return;
    }
    setBioSaving(true);
    try {
      await api.patch(`/api/user/bios`, { userId: user.id, bio: bioInput.trim() });
      setUser((prev) => prev ? { ...prev, bio: bioInput.trim() } : prev);
      closeBioDialog();
    } catch (err) {
      setBioError("Failed to save bio. Please try again.");
      console.error(err);
    } finally {
      setBioSaving(false);
    }
  };

  const charsLeft = BIO_MAX - bioInput.length;
  const counterColor =
    charsLeft < 0 ? "text-red-500" : charsLeft <= 20 ? "text-amber-500" : "dark:text-slate-500 text-slate-400";

  if (!user) return <LoadingSpinner />;

  const glassStyle = (subtle = false) => ({
    background: isDark ? "rgba(15,23,42,0.10)" : "rgba(255,255,255,0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: isDark
      ? `1px solid rgba(71,85,105,${subtle ? "0.35" : "0.45"})`
      : "1px solid rgba(255,255,255,0.9)",
    boxShadow: isDark
      ? `0 ${subtle ? 4 : 8}px ${subtle ? 24 : 40}px rgba(0,0,0,${subtle ? "0.25" : "0.35"})`
      : `0 ${subtle ? 4 : 8}px ${subtle ? 24 : 40}px rgba(15,23,42,${subtle ? "0.06" : "0.08"})`,
  });

  return (
    <div className="h-full overflow-y-auto px-6 py-10 dark:text-slate-100 bg-zinc-100 dark:bg-slate-950 dark:bg-opacity-10 text-slate-800">
      <div className="max-w-xl mx-auto flex flex-col gap-6">

        {/* Avatar + username hero */}
        <div
          className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
          style={glassStyle()}
        >
          {/* Avatar */}
          <button
            onClick={() => isOwnProfile && setDialogOpen(true)}
            className={`relative group focus:outline-none ${!isOwnProfile ? "cursor-default" : ""}`}
            title={isOwnProfile ? "Change avatar" : undefined}
          >
            <Avatar
              avatarUrl={user.avatar}
              name={user.username}
              className="min-h-30 min-w-30 max-h-52 rounded-full"
            />
            {isOwnProfile && (
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
            <p className="text-sm mt-1 dark:text-slate-400 text-slate-500">{user.email}</p>
          </div>

          {/* Bio — clickable on own profile */}
          {isOwnProfile ? (
            <button
              onClick={openBioDialog}
              className="group relative text-sm dark:text-slate-400 text-slate-500 italic max-w-xs text-center hover:dark:text-slate-200 hover:text-slate-700 transition-colors"
              title="Edit bio"
            >
              {user.bio?.trim() ? user.bio : "No bio yet. Click to add one."}
              <span className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity inline-block">
                <svg className="w-3.5 h-3.5 inline -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
                </svg>
              </span>
            </button>
          ) : (
            <p className="text-sm dark:text-slate-500 text-slate-400 italic max-w-xs">
              {user.bio?.trim() || "No bio yet."}
            </p>
          )}
        </div>

        {/* Details card */}
        <div className="rounded-2xl overflow-hidden" style={glassStyle(true)}>
          {[
            ...(!isOwnProfile
              ? [{ label: "Send DM", value: <Link to={`/home/dm/${user.id}`} state={{ conversationId: user.id }} className="text-blue-600 hover:underline">Click here</Link> }]
              : []),
            { label: "Username", value: user.username },
            { label: "Email", value: user.email },
            { label: "User ID", value: user.id },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between px-6 py-4 ${
                i < arr.length - 1 ? "border-b dark:border-slate-700/50 border-slate-200/80" : ""
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

      {/* ── Avatar upload dialog ─────────────────────────────────── */}
      {dialogOpen && isOwnProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeAvatarDialog(); }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
              border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-slate-100 text-slate-800">Change Avatar</h2>
              <button onClick={closeAvatarDialog} className="dark:text-slate-400 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                  No image
                </div>
              )}
            </div>

            <div
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer dark:border-slate-600 border-slate-300 hover:border-blue-400 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <p className="text-sm dark:text-slate-400 text-slate-500">
                {selectedFile ? selectedFile.name : "Click to choose an image"}
              </p>
              <p className="text-xs dark:text-slate-600 text-slate-400 mt-1">JPEG, PNG, GIF, WebP · Max 2MB</p>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
            </div>

            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

            <div className="flex gap-3">
              <button onClick={closeAvatarDialog} className="flex-1 py-2 rounded-xl text-sm font-medium dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600 hover:opacity-80 transition-opacity">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={!selectedFile || uploading} className="flex-1 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {uploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bio edit dialog ──────────────────────────────────────── */}
      {bioDialogOpen && isOwnProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeBioDialog(); }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
              border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-slate-100 text-slate-800">Edit Bio</h2>
              <button onClick={closeBioDialog} className="dark:text-slate-400 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-1.5">
              <textarea
                value={bioInput}
                onChange={(e) => {
                  setBioInput(e.target.value);
                  setBioError("");
                }}
                placeholder="Tell people a little about yourself…"
                rows={4}
                className={`w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-colors
                  dark:bg-slate-800 bg-slate-100
                  dark:text-slate-100 text-slate-800
                  dark:placeholder-slate-500 placeholder-slate-400
                  ${charsLeft < 0
                    ? "border border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border dark:border-slate-700 border-slate-200 focus:ring-1 focus:ring-blue-500"
                  }`}
              />
              <div className="flex justify-between items-center">
                {bioError
                  ? <p className="text-xs text-red-500">{bioError}</p>
                  : <span />
                }
                <span className={`text-xs ml-auto ${counterColor}`}>
                  {charsLeft < 0 ? `${Math.abs(charsLeft)} over limit` : `${charsLeft} left`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeBioDialog}
                className="flex-1 py-2 rounded-xl text-sm font-medium dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600 hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleBioSave}
                disabled={bioSaving || charsLeft < 0}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {bioSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}