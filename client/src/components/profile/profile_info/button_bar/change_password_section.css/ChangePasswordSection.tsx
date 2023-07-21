import { useEffect, useState } from "react";
import "./change_password_section.css";
import Field from "./field/Field";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePasswordSection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  const handleErros = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        alert("Invalid user! Log in again!");
        localStorage.clear();
        navigate("/login");
      } else if (error.response.status === 400) {
        alert(
          "The old password doesn't match or the new is less than 8 chracters!"
        );
      } else if (error.response.status === 500) {
        alert("There is a problem with the server! Try again later!");
      } else {
        alert(`An error occured: ${error.message}`);
      }
    }
  };

  const handleChangePassword = async (
    event: React.FormEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      const data = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        imageUrl: null,
      };

      const response = await axios.patch(
        `http://localhost:8080/api/users/${localStorage.getItem("id")}`,
        data
      );

      alert("Successfully change password");
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

  return (
    <section className="section" onSubmit={handleChangePassword}>
      <div className="button-bar-field">
        <div className="container button-bar-header-container">
          <h2 className="button-bar-header">Change Password</h2>
        </div>
        <form className="container button-bar-form">
          <div className="container change-password-field-container button-bar-data-container">
            <Field
              label="Old password"
              value={oldPassword}
              pattern="^\S{8,}$"
              title="Please enter a password with more than 7 non-whitespace characters"
              onChange={handleInputChange}
            />
            <Field
              label="New password"
              value={newPassword}
              pattern="^\S{8,}$"
              title="Please enter a password with more than 7 non-whitespace characters"
              onChange={handleInputChange}
            />
            <Field
              label="Confirm new password"
              value={confirmNewPassword}
              pattern={newPassword}
              title="Please enter a password that matches"
              onChange={handleInputChange}
            />
          </div>
          <div className="container">
            <button className="button-bar-button" type="submit">
              Change
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChangePasswordSection;
