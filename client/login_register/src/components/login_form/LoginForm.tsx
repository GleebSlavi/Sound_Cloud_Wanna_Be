import './login_form.css'
import Field from '../field/Field'

const Login = () => {
    return (
        <form className="login-form">
            <Field labelValue='Username' inputType='text'/>
            <Field labelValue='Password' inputType='password' />
            <div className='button-container'>
                <button className="form-button" type='submit'>Login</button>
            </div>
        </form>
    )
}

export default Login;