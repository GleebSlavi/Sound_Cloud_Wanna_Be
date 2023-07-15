import "./register_form.css";
import Field from "../field/Field";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleRegistration = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const registerData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        registerData
      );
      console.log(response.data);

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }

    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <form className="register-form">
      <Field
        labelValue="Username"
        inputType="text"
        value={username}
        onChange={handleInputChange}
      />
      <Field
        labelValue="Email"
        inputType="email"
        value={email}
        onChange={handleInputChange}
      />
      <Field
        labelValue="Password"
        inputType="password"
        value={password}
        onChange={handleInputChange}
      />
      <button
        className="register-form-button"
        type="submit"
        onClick={handleRegistration}
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
