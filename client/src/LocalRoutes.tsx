import { Routes, Route } from "react-router-dom";
import LoginRegisterMain from "./components/login_register/Main";
import AppRoutes from "./components/AppRoutes";

const LocalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppRoutes />} />
      <Route path="/login" element={<LoginRegisterMain />} />
    </Routes>
  );
};

export default LocalRoutes;
