import React from "react";
import { useLocation } from "react-router-dom";
import { MainRouter } from "./routes/MainRouter";
import { Navigation } from "./components/Layout/Navigation/Navigation.jsx";
import { Footer } from "./components/Layout/Footer/Footer.jsx";
import { useScreenWidth } from "./utils/customHooks";
import { AuthRoute } from "./routes/AuthRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import "./App.css"; // Подключаем обычные стили

const App = () => {
  const location = useLocation();
  const width = useScreenWidth();

  // Если пользователь на страницах логина, регистрации или сброса пароля
  if (["/login", "/register", "/reset"].includes(location.pathname)) {
    return (
      <AuthRoute>
        <MainRouter />
      </AuthRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="container">
        {width > 768 ? (
          <div className="innerContainer">
            <div className="containerNavigation">
              <Navigation />
              <div className="mainContent">
                <MainRouter />
              </div>
            </div>
            <Footer />
          </div>
        ) : (
          <div className="innerContainer">
            <div className="mobileMain">
              <MainRouter />
            </div>
            <Navigation />
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default App;
