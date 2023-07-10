import './register_form.css'
import Field from '../field/Field'

const RegisterForm = () => {
    return (
        <form className="register-form">
            <Field labelValue='Username' inputType='text'/>
            <Field labelValue='Email' inputType='email'/>
            <Field labelValue='Password' inputType='password' />
            <div className='button-container'>
                <button className="form-button" type='submit'>Register</button>
            </div>
        </form>
    )
}

export default RegisterForm;