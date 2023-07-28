import { useParams } from "react-router-dom";
import "./burger_menu.css"
import axios from "axios";

interface Props {
  isYours: boolean;
  isBarVisible: boolean;
  ref?: React.Ref<HTMLDivElement>;
  onClick: () => void;
  isPublic: boolean;
  setTypeChanged: (value: boolean) => void;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  setIsDeleteWindowVisible: (value: boolean) => void;
  handleBlur: () => void;
}

const BurgerMenuPlaylist = ({ isYours, isBarVisible, ref, onClick, isPublic, setTypeChanged, isFavorite,
  setIsFavorite, setIsDeleteWindowVisible, handleBlur }: Props) => {

  const { uuid } = useParams();

  const handleFavoritesChange = async () => {
    try {
      !isFavorite
        ? await axios.post(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}/favorite/${uuid}`,
          {
           headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }
        )
        : await axios.delete(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}/favorite/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
         }
        )

      onClick();
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log(error);
    }
  }

  const handleTypeChange = async () => {
    try {
      const data = {
        userId: localStorage.getItem("id"),
        type: isPublic ? "PRIVATE" : "PUBLIC"
      }

      await axios.patch(
        `${process.env.REACT_APP_PLAYLISTS_ENDPOINT}/${uuid}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      onClick();
      setTypeChanged(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div ref={ref} className={`contianer burger-menu-playlist${isYours ? " bigger-menu" : ""}
    ${isBarVisible ? " visible" : ""}`} onBlur={handleBlur} tabIndex={0}>
       <div className="container border-bottom-container">
        <span className="burger-menu-text" onClick={handleFavoritesChange}>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
      </div>
      {isYours && (
        <div>
          <div className={`container${isYours ? " border-bottom-container" : ""}`}>
            <span className="burger-menu-text" onClick={() => {
              setIsDeleteWindowVisible(true);
              onClick();}}>Delete playlist</span>
          </div>
          <div className="container">
            <span className="burger-menu-text" onClick={handleTypeChange}>{
              isPublic ? "Make private" : "Make public"
            }</span>
        </div> 
      </div>
      )}
    </div>
  )
}

export default BurgerMenuPlaylist;