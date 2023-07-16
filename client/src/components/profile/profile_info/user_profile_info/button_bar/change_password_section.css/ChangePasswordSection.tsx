import "./change_password_section.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ChangePasswordSection = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const getType = (showPassword: boolean): string => {
    return showPassword ? 'text' : 'password';
  };

  return (
    <section className="change-password-section">
      <div className="change-password-field">
        <div className="change-password-header-container">
          <h2 className="change-password-header">Change Password</h2>
        </div>
        <div className="change-password-field-container">
          <div className="password-field-container">
            <label className="password-label">Old password:</label>
            <div className="change-password-container">
              <input className="change-password-input" placeholder="Enter old password" 
              type={getType(showOldPassword)}/>
              <button className='change-password-eye-button' type="button" onClick={ () => setShowOldPassword(!showOldPassword) }>
                <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>
          <div className="password-field-container">
            <label className="password-label">New password:</label>
            <div className="change-password-container">
              <input className="change-password-input" placeholder="Enter new password" 
              type={getType(showNewPassword)}/>
              <button className='change-password-eye-button' type="button" onClick={ () => setShowNewPassword(!showNewPassword) }>
                <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>
          <div className="password-field-container">
            <label className="password-label">Confirm new password:</label>
            <div className="change-password-container">
              <input className="change-password-input" placeholder="Enter confirm new password" 
              type={getType(showConfirmNewPassword)}/>
              <button className='change-password-eye-button' type="button" onClick={ () => setShowConfirmNewPassword(!showConfirmNewPassword) }>
                <FontAwesomeIcon icon={showConfirmNewPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>
        </div>
        <div className="change-password-button-container">
          <button className="change-password-button" type="button">
            Change
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChangePasswordSection;