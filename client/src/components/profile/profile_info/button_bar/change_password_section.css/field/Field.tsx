import "./field.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  label: string;
  pattern: string;
  title: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({ label, pattern, title, value, onChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const getType = (): string => {
    return showPassword ? "text" : "password";
  };

  return (
    <div className="password-field-container">
      <label className="password-label">{label + ":"}</label>
      <div className="change-password-container">
        <input
          className="change-password-input"
          placeholder={"Enter " + label.toLowerCase()}
          type={getType()}
          name={label.toLowerCase()}
          onChange={onChange}
          value={value}
          pattern={pattern}
          title={title}
          required
        />
        <button
          className="change-password-eye-button"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
        </button>
      </div>
    </div>
  );
};

export default Field;
