import axios from "axios";
import "./delete_window.css";
import { useNavigate, useParams } from "react-router-dom";
import { deleteFileFromS3 } from "../../../../s3/s3";
import { awsPlaylistPicturesBucket, playlistsEndpoint } from "../../../../reusable_parameters/reusable_parameters";

interface Props {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  imgKey: string | null;
}

const DeleteWindow = ({ isVisible, setIsVisible, imgKey }: Props) => {
  const navigate = useNavigate();

  const { uuid } = useParams();

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${playlistsEndpoint}/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (imgKey) {
        deleteFileFromS3(
          imgKey,
          awsPlaylistPicturesBucket
        );
      }

      setIsVisible(false);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${isVisible && "container delete-window-container"}`}>
      <div className={`delete-window${isVisible ? " visible" : ""}`}>
        <div className="container">
          <h2 className="delete-header">Do you want to delete the playlist?</h2>
        </div>
        <div className="container delete-playlist-button-container">
          <div className="container left-button-container">
            <button
              className="delete-window-button"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          <div className="container right-button-container">
            <button
              className="delete-window-button"
              type="button"
              onClick={() => setIsVisible(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteWindow;
