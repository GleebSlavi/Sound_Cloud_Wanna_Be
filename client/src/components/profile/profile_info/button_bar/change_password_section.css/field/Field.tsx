import "./field.css"
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  label: string;
}

const Field = ({ label }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const getType = (): string => {
    return showPassword ? 'text' : 'password';
  };
  
  return (
    <div className="password-field-container">
      <label className="password-label">{label + ":"}</label>
      <div className="change-password-container">
        <input className="change-password-input" placeholder={"Enter " + label.toLowerCase()}
        type={getType()}/>
        <button className='change-password-eye-button' type="button" onClick={ () => setShowPassword(!showPassword) }>
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
        </button>
      </div>
    </div>
  )
}

export default Field;