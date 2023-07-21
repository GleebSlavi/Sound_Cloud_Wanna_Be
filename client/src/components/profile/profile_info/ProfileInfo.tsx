import "./profile_info.css";
import ButtonBar from "./button_bar/ButtonBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import default_picture from '../../../pictures/default_profile_picture.png'
import { s3 } from "../../../s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from 'nanoid';

const ProfileInfo = () => {
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [hovering, setHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try{
        const response = await axios.get(
          `http://localhost:8080/api/users/${localStorage.getItem("id")}`);

        setUsername(response.data.username);
        response.data.imageUrl && (setImageUrl(response.data.imageUrl));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setUsername, setImageUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files && event.target.files[0];
      if (file) {
      const key = nanoid(32)
      const command = new PutObjectCommand({
        Bucket: process.env.REACT_APP_AWS_PROFILE_PICTURES_BUCKET,
        Key: key,
        Body: file
      });

      const response = await s3.send(command);
      setImageUrl(`https://${process.env.REACT_APP_AWS_PROFILE_PICTURES_BUCKET}.s3.${process.env.REACT_APP_AWS_BUCKET_REGION}.amazonaws.com/${key}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <div className="profile-container">
      <div className="profile-picture-container">
        <img className="profile-picture" 
        src={ !imageUrl ? default_picture : imageUrl}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        />
        {hovering && <span className="change-image-text">{!imageUrl ? "Add photo" : "Change photo"}</span>}
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      </div>
      <div className="user-profile-info-container">
        <h2 className="user-username-header">{username}</h2>
        <ButtonBar />
      </div>
    </div>
  );
};

export default ProfileInfo;
