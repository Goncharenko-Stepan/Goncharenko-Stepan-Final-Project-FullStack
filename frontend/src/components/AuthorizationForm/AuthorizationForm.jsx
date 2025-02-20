import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginUser,
  registerUser,
  resetPassword,
} from "../../store/actionCreators/authActionCreators";
import style from "./AuthorizationForm.module.css";

const AuthorizationForm = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Настройки формы через react-hook-form
  const {
    register, // Метод для привязки полей формы
    handleSubmit, // Метод для обработки отправки формы
    formState: { errors }, // Ошибки валидации формы
  } = useForm();

  // Функция обработки отправки формы
  const onSubmit = async (data) => {
    try {
      if (type === "register" && data.username && data.email && data.fullName) {
        //  Если это регистрация, собираем данные и отправляем
        const dataRegister = {
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        };

        console.log("Отправка регистрации:", dataRegister);
        await dispatch(registerUser(dataRegister)).unwrap(); // Отправляем запрос на регистрацию

        navigate("/login"); // После регистрации переходим на страницу логина
      } else if (type === "login" && data.usernameOrEmail) {
        // Если это логин, собираем данные и отправляем
        const dataLogin = {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        };

        console.log("Отправка логина:", dataLogin);
        await dispatch(loginUser(dataLogin)).unwrap(); // Отправляем запрос на логин
        console.log("Успешный логин, перенаправляем на главную");

        setTimeout(() => {
          navigate("/"); // Перенаправляем на главную страницу после логина
        }, 0);
      } else if (type === "reset" && data.usernameOrEmail) {
        // Если это сброс пароля, отправляем email или username

        const dataReset = { usernameOrEmail: data.usernameOrEmail };
        console.log("Отправка запроса на сброс пароля:", dataReset);
        await dispatch(resetPassword(dataReset)).unwrap(); // Отправляем запрос на сброс пароля
        navigate("/login"); // После сброса пароля переходим на страницу логина
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.formContainer}>
      {/* 🟢 Форма регистрации (отображается только при type === "register") */}
      {type === "register" && (
        <>
          {/* Поле Email */}
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className={style.input}
          />
          {errors.email && (
            <span className={style.error}>{errors.email.message}</span>
          )}

          {/* Поле полного имени */}
          <input
            {...register("fullName", {
              required: "Name is required",
              maxLength: 32,
            })}
            placeholder="Name"
            className={style.input}
          />
          {errors.fullName && (
            <span className={style.error}>{errors.fullName.message}</span>
          )}

          {/* Поле имени пользователя */}
          <input
            {...register("username", {
              required: "Username is required",
              maxLength: 24,
            })}
            placeholder="Username"
            className={style.input}
          />
          {errors.username && (
            <span className={style.error}>{errors.username.message}</span>
          )}
        </>
      )}

      {/* 🟢 Форма логина и сброса пароля (отображается при type !== "register") */}
      {type !== "register" && (
        <>
          {/* Поле ввода логина или email */}
          <input
            {...register("usernameOrEmail", {
              required: "Username or email is required",
            })}
            placeholder="Username or email"
            className={style.input}
          />
          {errors.usernameOrEmail && (
            <span className={style.error}>
              {errors.usernameOrEmail.message}
            </span>
          )}
        </>
      )}

      {/* 🟢 Поле пароля (скрывается только при сбросе пароля) */}
      {type !== "reset" && (
        <>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: 8,
            })}
            placeholder="Password"
            className={style.input}
          />
          {errors.password && (
            <span className={style.error}>
              Password must be at least 8 characters
            </span>
          )}
        </>
      )}

      {/* 🟢 Кнопка отправки формы */}
      <button className={style.button} type="submit">
        {type === "register"
          ? "Sign up" // Текст кнопки для регистрации
          : type === "login"
          ? "Log in" // Текст кнопки для входа
          : "Reset your password"}{" "}
        {/* Текст кнопки для сброса пароля */}
      </button>
    </form>
  );
};

export default AuthorizationForm;
