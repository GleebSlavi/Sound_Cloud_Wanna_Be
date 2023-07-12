import SongController from "../song_controller/SongController";
import SongData from "../song_data/SongData";
import SongVolume from "../song_volume/SongVolume";
import "./player_bar.css";

const PlayerBar = () => {
  return <div className="player-bar">
    <SongData />
    <SongController />
    <SongVolume />
  </div>;
};

export default PlayerBar;
