import "./register_form.css";
import Field from "../field/Field";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authEndpoint } from "../../../reusable_parameters/reusable_parameters";

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterForm = ({ setIsVisible, setMessage }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleErrors = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      setIsVisible(true);
      if (error.response.status === 400) {
        setMessage(error.message);
      } else if (error.response.status === 500) {
        setMessage("There is a problem with the server! Try again later!");
      } else {
        setMessage(`An error occured: ${error.response.data.message}`);
      }
    }
  };

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
      case "confirm password":
        setConfirmPassword(value);
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
        `${authEndpoint}/register`,
        registerData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.userId);
      navigate("/");
    } catch (error) {
      handleErrors(error);
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <form className="register-form" onSubmit={handleRegistration}>
      <Field
        labelValue="Username"
        inputType="text"
        value={username}
        pattern="^[A-Za-z][A-Za-z0-9_.-]{3,}$"
        title="Please enter a username that starts with a letter and is more than 3 characters"
        onChange={handleInputChange}
      />
      <Field
        labelValue="Email"
        inputType="email"
        value={email}
        pattern="^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,}$"
        title="Please enter a valid email address"
        onChange={handleInputChange}
      />
      <Field
        labelValue="Password"
        inputType="password"
        value={password}
        pattern="^\S{8,}$"
        title="Please enter a password with more than 7 non-whitespace characters"
        onChange={handleInputChange}
      />
      <Field
        labelValue="Confirm password"
        inputType="password"
        value={confirmPassword}
        pattern={password}
        title="Please enter a password that matches"
        onChange={handleInputChange}
      />
      <button className="register-form-button" type="submit">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
