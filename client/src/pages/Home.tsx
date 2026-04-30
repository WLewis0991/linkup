import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Home() {


  return (
    <div className="flex flex-row">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}