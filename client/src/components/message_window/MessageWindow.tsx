import { String } from "aws-sdk/clients/cloudtrail";
import "./message_window.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: String;
  profileButtonPage: boolean;
}

const MessageWindow = ({ isVisible, setIsVisible, message, profileButtonPage }: Props) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    setIsVisible(false);
    if (profileButtonPage) {
      navigate("/profile");
    }
  }

  return (
    <div className={`${isVisible && "container message-window-container"}`}>
      <div className={`message-window${isVisible ? " visible" : ""}`}>
        <div className="container">
          <span className="message-text">{message}</span>
        </div>
        <div className="container">
          <button
            className="ok-button"
            type="button"
            onClick={handleOnClick}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageWindow;
