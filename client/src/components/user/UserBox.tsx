import "./user_box.css";
import { useNavigate } from "react-router-dom";
import default_picture from "../../pictures/default_profile_picture.png";

interface Props {
  id: string;
  username: string;
  imageUrl: string | null;
}

const UserBox = ({ id, username, imageUrl }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="user-box"
      onClick={() => {
        navigate(
          id === localStorage.getItem("id") ? "/profile" : `/profile/${id}`
        );
      }}
    >
      <div className="container user-box-picture-container">
        <img
          className="user-picture"
          src={imageUrl ? imageUrl : default_picture}
        />
      </div>
      <div className="container user-box-username-container">
        <span className="user-box-username">{username}</span>
      </div>
    </div>
  );
};

export default UserBox;
