import './App.css';
import { BrowserRouter } from 'react-router-dom';
import LoginRegisterMain from './components/login_register/main/Main';

const App = () => {
  return (
    <BrowserRouter>
      <LoginRegisterMain />
    </BrowserRouter>
  );
}

export default App;
