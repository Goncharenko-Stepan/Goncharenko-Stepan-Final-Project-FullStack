import { useLocation } from "react-router-dom";
import { MainRouter } from "./routes/MainRouter.jsx";
import React, { useEffect, useState } from "react";
import { PrivateRoute } from "./routes/PrivateRoute.jsx";
import { AuthRoute } from "./routes/AuthRoute.jsx";
import "./App.css";

function App() {
  const location = useLocation();

  // Состояние для хранения ширины экрана
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/reset"
  ) {
    return (
      <AuthRoute>
        <MainRouter />
      </AuthRoute>
    );
  } else {
    if (width > 768) {
      return (
        <PrivateRoute>
          <div className="app-container">
            <div className="main-container">
              <div className="main-content">
                <MainRouter />
              </div>
            </div>
          </div>
        </PrivateRoute>
      );
    } else {
      return (
        <PrivateRoute>
          <div className="app-container">
            <div className="main-container-mobile">
              <MainRouter />
            </div>
          </div>
        </PrivateRoute>
      );
    }
  }
}

export default App;
