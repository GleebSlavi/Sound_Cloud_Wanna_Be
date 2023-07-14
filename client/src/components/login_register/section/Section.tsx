import "./section.css";
import LoginForm from "../login_form/LoginForm";
import RegisterForm from "../register_form/RegisterForm";
import { useState } from "react";

const Section = () => {
  const [isRegisterForm, setRegisterForm] = useState(false);

  return (
    <section className="login-register-section-container">
      <h2 className="login-register-header">SoundCloud Wanna&ndash;Be</h2>
      {!isRegisterForm ? <LoginForm /> : <RegisterForm />}
      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" />
          <span
            className="slider round"
            onClick={() => setRegisterForm(!isRegisterForm)}
          ></span>
        </label>
      </div>
    </section>
  );
};

export default Section;