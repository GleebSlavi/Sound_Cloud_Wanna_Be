import { String } from "aws-sdk/clients/cloudtrail";
import "./message_window.css";
import { useState } from "react";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: String;
}

const MessageWindow = ({ isVisible, setIsVisible, message }: Props) => {
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
            onClick={() => setIsVisible(false)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageWindow;
