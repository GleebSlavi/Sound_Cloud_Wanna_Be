import "./profile_info.css";
import ButtonBar from "./button_bar/ButtonBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import default_picture from "../../../pictures/default_profile_picture.png";
import { useLocation, useParams } from "react-router-dom";
import { usersEndpoint } from "../../../reusable_parameters/reusable_parameters";

interface Props {
  setUsernameForPlaylist: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileInfo = ({ setUsernameForPlaylist }: Props) => {
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPremium, setIsPremium] = useState(false);

  const { uuid } = useParams();

  const location = useLocation();

  const checkPath = () => {
    return location.pathname === "/profile";
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${usersEndpoint}/${
            checkPath() ? localStorage.getItem("id") : uuid
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsername(response.data.username);
        if (!checkPath()) {
          setUsernameForPlaylist(response.data.username);
        }
        setIsPremium(response.data.isPremium);
        response.data.imageUrl && setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [uuid]);

  return (
    <div className="container profile-container">
      <div className="container profile-picture-container">
        <img
          className="profile-picture"
          src={!imageUrl ? default_picture : imageUrl}
        />
      </div>
      <div className="container user-profile-info-container">
        <div className="container profile-header-container">
          <h2 className="user-username-header">{username}</h2>
          <h3 className="profile-user-tier">
            {isPremium ? "Premium" : "Free"}
          </h3>
        </div>
        {checkPath() ? <ButtonBar /> : <div></div>}
      </div>
    </div>
  );
};

export default ProfileInfo;
