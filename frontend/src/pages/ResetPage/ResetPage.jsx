import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import lock from "../../assets/lock.svg";
import styles from "./ResetPage.module.css";
import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm.jsx";

export const ResetPage = () => {
  return (
    <>
      <Link to="/login" className={styles.logoLink}>
        <img src={logo} alt="Ichgram" />
      </Link>
      <hr className={styles.hr} />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <img src={lock} alt="Lock" />
          <p className={styles.textSize2}>Не получается войти?</p>
          <p className={styles.textSize1}>
            Введите вашу почту, номер телефона, или имя пользователся и мы
            отправим вам ссылку что бы вы могли войти в аккаунт.
          </p>
          <AuthorizationForm type="reset" />
          <div className={styles.divider}>
            <p>_____________</p>
            <p className={styles.dividerText}>ИЛИ</p>
            <p>_____________</p>
          </div>
          <Link to="/register" className={styles.registerLink}>
            Create new account
          </Link>
        </div>
        <div className={styles.loginLinkDiv}>
          <Link to="/login" className={styles.loginLink}>
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
};
