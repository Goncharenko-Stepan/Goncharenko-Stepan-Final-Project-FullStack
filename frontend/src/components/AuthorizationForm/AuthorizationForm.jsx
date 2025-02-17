import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  userLogin,
  registerUser,
  resetPassword,
} from "../../store/actionCreators/authActionCreators";
import style from "./AuthorizationForm.module.css";

const AuthorizationForm = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (type === "register" && data.username && data.email && data.fullName) {
        const dataRegister = {
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        };

        console.log("📡 Отправка регистрации:", dataRegister);
        await dispatch(registerUser(dataRegister)).unwrap();
        navigate("/login");
      } else if (type === "login" && data.usernameOrEmail) {
        const dataLogin = {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        };

        console.log("Отправка логина:", dataLogin);
        await dispatch(userLogin(dataLogin)).unwrap();
        console.log("Успешный логин, перенаправляем на главную");
        setTimeout(() => {
          navigate("/");
        }, 0);
      } else if (type === "reset" && data.usernameOrEmail) {
        const dataReset = { usernameOrEmail: data.usernameOrEmail };
        console.log("Отправка запроса на сброс пароля:", dataReset);
        await dispatch(resetPassword(dataReset)).unwrap();
        navigate("/login");
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.formContainer}>
      {type === "register" && (
        <>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className={style.input}
          />
          {errors.email && (
            <span className={style.error}>{errors.email.message}</span>
          )}

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

      {type !== "register" && (
        <>
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

      <button className={style.button} type="submit">
        {type === "register"
          ? "Sign up"
          : type === "login"
          ? "Log in"
          : "Reset your password"}
      </button>
    </form>
  );
};

export default AuthorizationForm;
