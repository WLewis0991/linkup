import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Home() {


return (
  <div className="flex flex-row h-full">
    <NavBar />
    <div className="flex-1 min-h-0 overflow-hidden">
      <Outlet />
    </div>
  </div>
);
}