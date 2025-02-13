import { Link } from "react-router";
import React from "react";
import styles from "./LoginPage.module.css";
import logo from "../../assets/logo.svg";
import Background from "../../assets/Background.svg";
import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm.jsx";

export const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.backgroundImage}
          src={Background}
          alt="Background ICHgram"
        />
      </div>

      <div className={styles.unitedFormContainer}>
        <div className={styles.formContainer}>
          <img src={logo} alt="Logotype ICHgram" />

          <AuthorizationForm type="login" />

          <div className={styles.divider}>
            <p>_____________</p>
            <p className={styles.dividerText}>ИЛИ</p>
            <p>_____________</p>
          </div>

          <Link className={styles.link} to="/reset">
            Забыли пароль?
          </Link>
        </div>

        <div className={styles.registerContainer}>
          <p className={styles.registerText}>
            Нет аккаунта?
            <Link className={styles.registerLink} to="/register">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
