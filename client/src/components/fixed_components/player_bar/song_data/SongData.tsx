import "./song_data.css";

const SongData = () => {
  return (
    <div className="song-data-container">
      <div className="picture-container">
        <div className="picture"></div>
      </div>
      <div className="song-info-container">
        <div className="song-name-container">
          <p className="player-bar-song-name">Song name</p>
        </div>
        <div className="song-artist-container">
          <p className="player-bar-song-artist">Song artist</p>
        </div>
      </div>
    </div>
  );

}

export default SongData;