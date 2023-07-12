import "./main.css";
import Navbar from "../navbar/Navbar";
import PlayerBar from "../player_bar/PlayerBar";
import Section from "../section/Section";

const HomeMain = () => {
  return (
    <div className="home-main">
      <Navbar />
      <div  className="section-container">
        <Section />
      </div>
      <PlayerBar />
    </div>
  );
};

export default HomeMain;
