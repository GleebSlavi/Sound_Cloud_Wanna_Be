import "./login_form.css";
import Field from "../field/Field";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authEndpoint } from "../../../reusable_parameters/reusable_parameters";

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Login = ({ setIsVisible, setMessage }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleErrors = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      setIsVisible(true);
      if (error.response.status === 400) {
        setMessage("Invalid login data! Please try again!");
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
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        `${authEndpoint}/authenticate`,
        loginData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.userId);
      navigate("/");
    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <Field
        labelValue="Username"
        inputType="text"
        value={username}
        pattern="^[A-Za-z][A-Za-z0-9_.-]{3,}$"
        title="Please enter a username that starts with a letter and is more than 3 characters"
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
      <button className="login-form-button" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
