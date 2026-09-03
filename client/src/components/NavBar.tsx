import { Link, useNavigate } from "react-router-dom";
import LinkUpLogo from "./LinkUpLogo";
import { DarkModeToggle } from "../hooks/LightButton";
import { getCurrentUser } from "../auth/token";
import { logout } from "../auth/logout";

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

  return (
    <>
      <div className="min-w-52 h-full overflow-y-auto dark:bg-slate-900 dark:text-white dark:border-slate-800 border-zinc-200 border-r flex flex-col items-center pt-10 gap-5 dark:bg-opacity-10">
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
    </>
  );
}
