import { Routes, Route } from 'react-router-dom';
import LoginRegisterMain from './components/login_register/main/Main';
import HomeMain from './components/home/Main';

const LocalRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeMain />} />
      <Route path="/login" element={<LoginRegisterMain />}/>
    </Routes>
  )
}

export default LocalRoutes;