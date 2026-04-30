import { Link } from "react-router-dom";
import LinkUpLogo from "./LinkUpLogo";
import DarkModeToggle from "./Dark/LightButton";

export default function NavBar () {

    return(<>
    <div className="min-w-52 min-h-dvh dark:bg-slate-800 dark:text-white border-r flex flex-col items-center pt-10 gap-5" >
        <Link to="/home">
            <LinkUpLogo />
        </Link>
        <div className="h-1 w-3/4 border-b"> </div>
        <br />
        <Link to="/home/friends">
            <h1>Friends</h1>
        </Link>
        <br />
        <Link to="/home/groups">
            <h1>Groups</h1>
        </Link>
        <br />
        <Link to="/home/messages">
            <h1>Messages</h1>
        </Link>
        <br />
        <Link to="/home/profile">
            <h1>Profile</h1>
        </Link>
        <br />
        <DarkModeToggle />
    </div>
    </>)

}