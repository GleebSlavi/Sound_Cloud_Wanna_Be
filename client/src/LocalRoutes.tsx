import { Routes, Route } from "react-router-dom";
import LoginRegisterMain from "./components/login_register/main/Main";
import Main from "./components/main/Main";

const LocalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<LoginRegisterMain />} />
    </Routes>
  );
};

export default LocalRoutes;
