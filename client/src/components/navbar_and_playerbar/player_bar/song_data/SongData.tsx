import "./song_data.css";

const SongData = () => {
  return (
    <div className="container song-data-container">
      <div className="container picture-container">
        <div className="picture"></div>
      </div>
      <div className="container song-info-container">
        <div className="container song-name-container">
          <p className="player-bar-song-name player-bar-song-text">Song name</p>
        </div>
        <div className="container song-artist-container">
          <p className="player-bar-song-artist player-bar-song-text">
            Song artist
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongData;
