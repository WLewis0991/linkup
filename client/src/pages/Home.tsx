import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Home() {


return (
  <div className="flex flex-row h-full">
    <NavBar />
    <div className="flex-1 h-full min-h-0 overflow-hidden">
      <Outlet />
    </div>
  </div>
);
}