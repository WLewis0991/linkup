import { Link, NavLink, useNavigate } from "react-router-dom";
import LinkUpLogo from "./LinkUpLogo";
import { DarkModeToggle } from "../hooks/LightButton";
import { getCurrentUser } from "../auth/token";
import { logout } from "../auth/logout";

function tabClass({ isActive }: { isActive: boolean }) {
  return `flex-1 flex items-center justify-center px-1 py-2 min-h-11 text-xs transition-colors ${
    isActive
      ? "text-rose-500 font-semibold"
      : "text-slate-500 dark:text-slate-400"
  }`;
}

export default function NavBar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!currentUser) {
    return null;
  }

  const profilePath = `/home/profile/${currentUser.userId}`;

  return (
    <>
      {/* Mobile top strip */}
      <div className="md:hidden flex-shrink-0 flex items-center justify-between px-4 py-2 border-b dark:border-slate-800 border-zinc-200 dark:bg-slate-900 dark:bg-opacity-10">
        <Link to="/home" aria-label="LinkUp home">
          <LinkUpLogo size={32} />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <DarkModeToggle compact />
          <button
            onClick={handleLogout}
            className="text-red-400 text-sm"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Desktop sidebar (unchanged) */}
      <div className="hidden md:flex min-w-52 h-full overflow-y-auto dark:bg-slate-900 dark:text-white dark:border-slate-800 border-zinc-200 border-r flex-col items-center pt-10 gap-5 dark:bg-opacity-10">
        <Link to="/home">
          <LinkUpLogo />
        </Link>
        <div className="h-1 w-3/4 dark:border-slate-800 border-zinc-200 border-b">
          {" "}
        </div>
        <br />
        <Link to="/home/people">
          <h1>People</h1>
        </Link>
        <br />
        <Link to="/home/rooms">
          <h1>Rooms</h1>
        </Link>
        <br />
        <Link to="/home/messages">
            <h1>Messages</h1>
        </Link>
        <br /> 
        <Link to={`/home/profile/${currentUser.userId}`}>
          <h1>Profile</h1>
        </Link>
        <br />
        <DarkModeToggle />
        <br />
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden flex-shrink-0 flex border-t dark:border-slate-800 border-zinc-200 dark:bg-slate-900 bg-white dark:bg-opacity-95 pb-[env(safe-area-inset-bottom)]">
        <NavLink to="/home" end className={tabClass}>
          Home
        </NavLink>
        <NavLink to="/home/people" className={tabClass}>
          People
        </NavLink>
        <NavLink to="/home/rooms" className={tabClass}>
          Rooms
        </NavLink>
        <NavLink to="/home/messages" className={tabClass}>
          Messages
        </NavLink>
        <NavLink to={profilePath} className={tabClass}>
          Profile
        </NavLink>
      </nav>
    </>
  );
}
