import ButtonBar from "../button_bar/ButtonBar";
import Navbar from "../navbar/Navbar";
import PlayerBar from "../player_bar/PlayerBar";
import Section from "../section/Section";

const HomeMain = () => {
  return (
    <div>
      <Navbar />
      <ButtonBar />
      <Section />
      <PlayerBar />
    </div>
  );
};

export default HomeMain;
