import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import React from "react";
import style from "./AuthorizationForm.module.css";

const AuthorizationForm = ({ type }) => {
  const navigate = useNavigate();

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

        console.log("Register data:", dataRegister);
        navigate("/login");
      } else if (type === "login" && data.usernameOrEmail) {
        const dataLogin = {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        };

        console.log("Login Data:", dataLogin);
        navigate("/");
      } else if (type === "reset" && data.usernameOrEmail) {
        const dataReset = { usernameOrEmail: data.usernameOrEmail };
        console.log("Reset Password Data:", dataReset);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const btnTitle =
    type === "register"
      ? "Sign up"
      : type === "login"
      ? "Log in"
      : "Reset your password";

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

      {type === "register" && (
        <>
          <p className={style.text}>
            People who use our service may have uploaded your contact
            information to ICHgram <a className={style.link}>Learn More</a>
          </p>
          <p className={style.text}>
            By signing up, you agree to our <a className={style.link}>Terms</a>,
            <a className={style.link}> Privacy Policy</a> and
            <a className={style.link}> Cookies Policy</a>.
          </p>
        </>
      )}

      <button className={style.button} type="submit">
        {btnTitle}
      </button>
    </form>
  );
};

export default AuthorizationForm;
