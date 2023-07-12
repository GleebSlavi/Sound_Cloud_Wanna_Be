import "./main.css";
import { Route, Routes } from 'react-router-dom';
import Navbar from "../reusable_components/navbar/Navbar";
import PlayerBar from "../reusable_components/player_bar/PlayerBar";
import HomeSection from "../home/Section";
import StreamsSection from "../streams/Section";
import ProfileSection from "../profile/section/Section";

const Main = () => {
  return (
    <div className="home-main">
      <Navbar />
      <div  className="section-container">
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/streams" element={<StreamsSection />} />
        </Routes>
      </div>
      <PlayerBar />
    </div>
  );
};

export default Main;
