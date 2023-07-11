import './login_form.css'
import Field from '../field/Field'
import { useState } from 'react'
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        switch (name) {
          case 'username':
            setUsername(value);
            break;
          case 'password':
            setPassword(value);
            break;
          default:
            break;
        }
      };

    const handleLogin = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();

        const registerData = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post("http://localhost:8080/api/auth/authenticate", registerData);
            console.log(response.data);

			const token = response.data.token;
			localStorage.setItem("token", token);
        } catch (error) {
            console.log(error);
        }

        setUsername("");
        setPassword("");

      }

    return (
        <form className="login-form">
            <Field labelValue='Username' inputType='text'
            value={username} onChange={handleInputChange}/>
            <Field labelValue='Password' inputType='password' 
            value={password} onChange={handleInputChange}/>
            <div className='button-container'>
                <button className="form-button" type='submit'
                onClick={handleLogin}>Login</button>
            </div>
        </form>
    )
}

export default Login;