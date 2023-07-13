import './field.css'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface FieldProps {
  labelValue: string;
  inputType: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
}

const Field = ({ labelValue, inputType, value, onChange }: FieldProps) => {
  const lowerCaseLabel: string = labelValue.toLowerCase();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordCheck = (): boolean => {
    return lowerCaseLabel === 'password';
  }

  const getType = (): string => {
    return isPasswordCheck() ? (showPassword ? 'text' : inputType) : inputType;
  };

  return (
    <div className="field-container">
      <label>{ labelValue + ": " }</label>
      <div className='password-container'>
        <input 
        className={ isPasswordCheck() ? 'password-input' : "welcome-input" } 
        type={ getType() } 
        name={ lowerCaseLabel } 
        placeholder={ "Enter " + lowerCaseLabel }
        value={ value }
        onChange={ onChange }
        required
        />
        { isPasswordCheck() && (
          <button className='eye-button' type="button" onClick={ () => setShowPassword(!showPassword) }>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Field;