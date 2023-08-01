import "./profile_info.css";
import ButtonBar from "./button_bar/ButtonBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import default_picture from "../../../pictures/default_profile_picture.png";
import { useLocation, useParams } from "react-router-dom";

const ProfileInfo = () => {
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const { uuid } = useParams();

  const location = useLocation();

  const checkPath = () => {
    return location.pathname === "/profile";
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_USERS_ENDPOINT}/${
            checkPath() ? localStorage.getItem("id") : uuid
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsername(response.data.username);
        response.data.imageUrl && setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setUsername, setImageUrl]);

  return (
    <div className="container profile-container">
      <div className="container profile-picture-container">
        <img
          className="profile-picture"
          src={!imageUrl ? default_picture : imageUrl}
        />
      </div>
      <div className="container user-profile-info-container">
        <h2 className="user-username-header">{username}</h2>
        {checkPath() 
          ? <ButtonBar />
          : <div></div>
        } 
      </div>
    </div>
  );
};

export default ProfileInfo;
