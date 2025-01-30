import { Link } from "react-router-dom";
import style from "./RegisterPage.module.css";
import logo from "../../assets/logo.svg";
import { AuthorizationForm } from "../../components/AuthorizationForm/AuthorizationForm.jsx";

export const RegisterPage = () => {
  return (
    <div className="display-flex justify-center items-center min-h-screen">
      <div
        className={`${style.container} flex flex-col items-center justify-center
             border px-10 py-10 w-[90%] sm:w-[350px]`}
      >
        <img src={logo} alt="Logo image" className="mb-8" />
        <AuthorizationForm />
        <Link to="/login" className="mt-4 text-blue-500 hover:underline">
          Уже есть аккаунт? Войти
        </Link>
      </div>
    </div>
  );
};
