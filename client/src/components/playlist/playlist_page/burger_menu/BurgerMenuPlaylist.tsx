import { useParams } from "react-router-dom";
import "./burger_menu.css";
import axios from "axios";
import {
  playlistsEndpoint,
  usersEndpoint,
} from "../../../../reusable_parameters/reusable_parameters";

interface Props {
  isYours: boolean;
  isBarVisible: boolean;
  onClick: () => void;
  isPublic: boolean;
  setTypeChanged: (value: boolean) => void;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  setIsDeleteWindowVisible: (value: boolean) => void;
}

const BurgerMenuPlaylist = ({
  isYours,
  isBarVisible,
  onClick,
  isPublic,
  setTypeChanged,
  isFavorite,
  setIsFavorite,
  setIsDeleteWindowVisible,
}: Props) => {
  const { uuid } = useParams();

  const handleFavoritesChange = async () => {
    try {
      if (!isFavorite) {
        await axios.post(
          `${usersEndpoint}/${localStorage.getItem("id")}/favorite/${uuid}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.delete(
          `${usersEndpoint}/${localStorage.getItem("id")}/favorite/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      onClick();
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTypeChange = async () => {
    try {
      const data = {
        userId: localStorage.getItem("id"),
        type: isPublic ? "PRIVATE" : "PUBLIC",
      };

      await axios.patch(`${playlistsEndpoint}/${uuid}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onClick();
      setTypeChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`contianer burger-menu-playlist${isYours ? " bigger-menu" : ""}
    ${isBarVisible ? " visible" : ""}`}
    >
      <div className="container border-bottom-container">
        <span className="burger-menu-text" onClick={handleFavoritesChange}>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      </div>
      {isYours && (
        <div>
          <div
            className={`container${isYours ? " border-bottom-container" : ""}`}
          >
            <span
              className="burger-menu-text"
              onClick={() => {
                setIsDeleteWindowVisible(true);
                onClick();
              }}
            >
              Delete playlist
            </span>
          </div>
          <div className="container">
            <span className="burger-menu-text" onClick={handleTypeChange}>
              {isPublic ? "Make private" : "Make public"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenuPlaylist;
