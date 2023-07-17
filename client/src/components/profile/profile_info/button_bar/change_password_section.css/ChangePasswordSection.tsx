import "./change_password_section.css"
import Field from "./field/Field";

const ChangePasswordSection = () => {

  return (
    <section className="change-password-section">
      <div className="change-password-field">
        <div className="change-password-header-container">
          <h2 className="change-password-header">Change Password</h2>
        </div>
        <div className="change-password-field-container">
          <Field label="Old password"/>
          <Field label="New password" />
          <Field label="Confirm new password" />
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