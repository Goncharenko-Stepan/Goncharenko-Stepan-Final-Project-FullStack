import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm.jsx";
import { Link } from "react-router-dom";
import React from "react";
import logo from "../../assets/logo.svg";
import style from "./RegisterPage.module.css";

export const RegisterPage = () => {
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <img src={logo} alt="ICHgram" className={style.logo} />
        <p className={style.text}>
          Зарегистрируйтесь, чтобы увидеть фото и видео от ваших друзей.
        </p>
        <AuthorizationForm type="register" />
      </div>
      <div className={style.bottomContainer}>
        <p className={style.text}>
          Уже есть аккаунт?
          <Link className={style.link} to="/login">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};
