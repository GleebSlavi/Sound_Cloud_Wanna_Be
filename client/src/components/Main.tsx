import "./main.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./fixed_components/navbar/Navbar";
import PlayerBar from "./fixed_components/player_bar/PlayerBar";
import HomeSection from "./home/Section";
import StreamsSection from "./streams/Section";
import ProfileSection from "./profile/Section";
import CreatePlaylistSection from "./create_playlist/CreatePlaylistSection";
import AddSongSection from "./add_song/AddSongSection";
import ChangePasswordSection from "./change_password_section.css/ChangePasswordSection";

const Main = () => {
  return (
    <div className="home-main">
      <Navbar />
      <div className="section-container">
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/streams" element={<StreamsSection />} />
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/streams" element={<StreamsSection />} />
        </Routes>
      </div>
      <PlayerBar />
    </div>
  );
};

export default Main;
