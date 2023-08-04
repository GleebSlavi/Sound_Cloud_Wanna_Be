import { useState } from "react";
import "./edit_profile.css";
import Field from "./field/Field";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../../image_upload/ImageUpload";
import default_profile_picture from "../../../../../pictures/default_profile_picture.png";
import { uploadFileToS3 } from "../../../../../s3/s3";
import MessageWindow from "../../../../message_window/MessageWindow";

const EditProfileSection = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleErros = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      setIsVisible(true);
      if (error.response.status === 404) {
        setMessage("Invalid user! Log in again!");
        localStorage.clear();
        navigate("/login");
      } else if (error.response.status === 400) {
        setMessage(
          "The old password doesn't match or the new is less than 8 chracters!"
        );
      } else if (error.response.status === 500) {
        setMessage("There is a problem with the server! Try again later!");
      } else {
        setMessage(`An error occured: ${error.message}`);
      }
    }
  };

  const handleEditProfile = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      let imgS3Url;
      if (image) {
        imgS3Url = await uploadFileToS3(
          image,
          process.env.REACT_APP_AWS_PROFILE_PICTURES_BUCKET,
          null
        );
      }

      const data = {
        oldPassword: oldPassword ? oldPassword : null,
        newPassword: newPassword ? newPassword : null,
        imageUrl: image ? imgS3Url : null,
      };

      await axios.patch(
        `${process.env.REACT_APP_USERS_ENDPOINT}/${localStorage.getItem("id")}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsVisible(true);
      setMessage("Successfully updated you profile.");
      navigate("/profile");
    } catch (error) {
      handleErros(error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    switch (name) {
      case "old password":
        setOldPassword(value);
        break;
      case "new password":
        setNewPassword(value);
        break;
      case "confirm new password":
        setConfirmNewPassword(value);
        break;
      default:
        break;
    }
  };

  const isRequired = (firstField: string, secondField: string): boolean => {
    return !image || firstField !== "" || secondField !== "";
  };

  return (
    <section className="section edit-profile-section" onSubmit={handleEditProfile}>
      <div className="button-bar-field">
        <div className="container button-bar-header-container">
          <h2 className="button-bar-header">Edit Profile</h2>
        </div>
        <form className="container button-bar-form">
          <div className="container button-bar-data-container">
            <ImageUpload
              imgStyleClass=" edit-profile-picture"
              defaultPicture={default_profile_picture}
              imageUrl={imageUrl}
              setImage={setImage}
              setImageUrl={setImageUrl}
            />
            <div className="container change-password-field-container">
              <Field
                label="Old password"
                value={oldPassword}
                pattern="^\S{8,}$"
                title="Please enter a password with more than 7 non-whitespace characters"
                onChange={handleInputChange}
                isRequired={isRequired(newPassword, confirmNewPassword)}
              />
              <Field
                label="New password"
                value={newPassword}
                pattern="^\S{8,}$"
                title="Please enter a password with more than 7 non-whitespace characters"
                onChange={handleInputChange}
                isRequired={isRequired(oldPassword, confirmNewPassword)}
              />
              <Field
                label="Confirm new password"
                value={confirmNewPassword}
                pattern={newPassword}
                title="Please enter a password that matches"
                onChange={handleInputChange}
                isRequired={isRequired(oldPassword, newPassword)}
              />
            </div>
          </div>
          <div className="container">
            <button className="button-bar-button" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
      <MessageWindow
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        message={message}
        profileButtonPage={true}
      />
    </section>
  );
};

export default EditProfileSection;
