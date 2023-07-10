import './field.css'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface FieldProps {
  labelValue: string;
  inputType: string;
}

const Field = ({ labelValue, inputType }: FieldProps) => {
  const lowerCaseLabel: string = labelValue.toLowerCase();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordCheck = (): boolean => {
    return lowerCaseLabel === 'password';
  }

  const getType = (): string => {
    return isPasswordCheck() ? (showPassword ? 'text' : inputType) : inputType;
  };

  const handleTogglePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="field-container">
      <label>{labelValue + ": "}</label>
      <div className='password-container'>
        <input className={ isPasswordCheck() ? 'password-input' : "" } 
        type={ getType() } 
        name={ lowerCaseLabel } 
        placeholder={"Enter " + lowerCaseLabel} required/>
        { isPasswordCheck() && (
          <button className='eye-button' onClick={ handleTogglePassword }>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Field;