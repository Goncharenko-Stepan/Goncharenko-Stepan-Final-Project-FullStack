import { useLocation, Routes, Route } from "react-router-dom";
import { LoginPage, RegisterPage, ResetPage } from "../pages";

export const MainRouter = () => {
  const location = useLocation();
  const state = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        {/* Sing Up Роуты */}
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};
