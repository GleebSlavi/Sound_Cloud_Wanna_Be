import { useParams } from "react-router-dom";
import "./burger_menu_song.css"

interface Props {
  inPlaylist: boolean;
  isBarVisible: boolean;
  isYours: boolean
}


const BurgerMenuSong = ({ inPlaylist, isBarVisible, isYours }: Props) => {
  const { uuid } = useParams();

  return (
      <div className={`container burger-menu-song${inPlaylist ? " bigger-song-menu": ""}
      ${isBarVisible ? " visible" : ""}`}>
        <div className="container">
          <span className="burger-menu-text">Add to playlist</span>
        </div>
        {inPlaylist && isYours && (
        <div className="container bottom-menu-button-container">
          <span className="burger-menu-text">Remove from playlist</span>
        </div>
        )}
      </div>
  )
}

export default BurgerMenuSong;