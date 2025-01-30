import { useForm } from "react-hook-form";
import style from "./AuthorizationForm.module.css";
import { useNavigate } from "react-router";

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
        navigate("/login"); // исправлено
      } else if (type === "login" && data.usernameOrEmail) {
        const dataLogin = {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        };
        console.log("Login Data:", dataLogin);
        navigate("/"); // исправлено
      } else if (type === "reset" && data.usernameOrEmail) {
        const dataReset = { usernameOrEmail: data.usernameOrEmail };
        console.log("Reset Password Data:", dataReset);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let btnTitle =
    type === "register"
      ? "Sign up"
      : type === "login"
      ? "Log in"
      : "Reset your password";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${style.formContainer} flex flex-col gap-1.5 text-darkgray w-full`}
    >
      {type === "register" && (
        <>
          {/* Email */}
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
          />
          {errors.email && (
            <span className={style.error}>{errors.email.message}</span>
          )}

          {/* Full Name */}
          <input
            {...register("fullName", {
              required: "Name is required",
              maxLength: 32,
            })}
            placeholder="Name"
          />
          {errors.fullName && (
            <span className={style.error}>{errors.fullName.message}</span>
          )}

          {/* Username */}
          <input
            {...register("username", {
              required: "Username is required",
              maxLength: 24,
            })}
            placeholder="Username"
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
          <p className="text-xs mt-2.5 mb-4">
            People who use our service may have uploaded your contact
            information to ICHgram{" "}
            <a className="text-darkblue cursor-pointer">Learn More</a>
          </p>
          <p className="text-xs mt-2.5 mb-4">
            By signing up, you agree to our{" "}
            <a className="text-darkblue cursor-pointer">Terms</a>,
            <a className="text-darkblue cursor-pointer">Privacy Policy</a> and
            <a className="text-darkblue cursor-pointer">Cookies Policy</a>.
          </p>
        </>
      )}

      <button className="mt-3.5" type="submit">
        {btnTitle}
      </button>
    </form>
  );
};

export default AuthorizationForm;
