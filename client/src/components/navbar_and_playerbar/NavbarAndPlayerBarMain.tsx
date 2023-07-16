import { Outlet } from "react-router-dom";
import "./navbar_playerbar_main.css";
import Navbar from "./navbar/Navbar";
import PlayerBar from "./player_bar/PlayerBar";

const NavbarAndPlayerBarMain = () => {
  return (
    <div className="navbar_playerbar_main">
      <Navbar />
      <Outlet />
      <PlayerBar />
    </div>
  );
};

export default NavbarAndPlayerBarMain;
