import "./field.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  labelValue: string;
  inputType: string;
  value: string;
  pattern: string;
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({
  labelValue,
  inputType,
  value,
  pattern,
  title,
  onChange,
}: Props) => {
  const lowerCaseLabel: string = labelValue.toLowerCase();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordCheck = (): boolean => {
    return lowerCaseLabel.includes("password");
  };

  const getType = (): string => {
    return isPasswordCheck() ? (showPassword ? "text" : inputType) : inputType;
  };

  return (
    <div className="container field-container">
      <label>{labelValue + ": "}</label>
      <div className="password-container">
        <input
          className={isPasswordCheck() ? "password-input" : "welcome-input"}
          type={getType()}
          name={lowerCaseLabel}
          placeholder={"Enter " + lowerCaseLabel}
          value={value}
          onChange={onChange}
          pattern={pattern}
          title={title}
          required
        />
        {isPasswordCheck() && (
          <button
            className="eye-button"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Field;
