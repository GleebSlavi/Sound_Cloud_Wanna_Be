import "./section.css";
import LoginForm from "../login_form/LoginForm";
import RegisterForm from "../register_form/RegisterForm";
import { useState } from "react";
import MessageWindow from "../../message_window/MessageWindow";

const Section = () => {
  const [isRegisterForm, setRegisterForm] = useState(false);

  const [isMessageWindowVisible, setIsMessageWindowVisible] = useState(false);
  const [windowMessage, setWindowMessage] = useState("");

  return (
    <section className="login-register-section-container">
      <h2 className="login-register-header">SoundCloud Wanna&ndash;Be</h2>
      {!isRegisterForm ? (
        <LoginForm
          setMessage={setWindowMessage}
          setIsVisible={setIsMessageWindowVisible}
        />
      ) : (
        <RegisterForm
          setMessage={setWindowMessage}
          setIsVisible={setIsMessageWindowVisible}
        />
      )}
      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" />
          <span
            className="slider round"
            onClick={() => setRegisterForm(!isRegisterForm)}
          ></span>
        </label>
      </div>
      <MessageWindow
        isVisible={isMessageWindowVisible}
        setIsVisible={setIsMessageWindowVisible}
        message={windowMessage}
        profileButtonPage={false}
      />
    </section>
  );
};

export default Section;
