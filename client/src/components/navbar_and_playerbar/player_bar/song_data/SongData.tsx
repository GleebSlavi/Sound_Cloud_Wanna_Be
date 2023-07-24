import "./song_data.css";
import { usePlayerContext } from "../../../../provider/PlayerProvider";
import { useEffect } from "react";
import default_song_picture from "../../../../pictures/default_song_picture.png"

const SongData = () => {
  const { currentPlaylist, currentPlaylistIndex } = usePlayerContext();

  const currentSong = currentPlaylist[currentPlaylistIndex];

  return (
    <div className="container song-data-container">
      <div className="container">
        { currentSong && (
          <img className="picture" src={currentSong.imageUrl ? currentSong.imageUrl : default_song_picture}/>
        )}
      </div>
      <div className="container song-info-container">
        <div className="container song-name-container">
          <span className="player-bar-song-name player-bar-song-text">{currentSong?.name}</span>
        </div>
        <div className="container song-artist-container">
          <span className="player-bar-song-artist player-bar-song-text">
            {currentSong?.artist}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongData;
