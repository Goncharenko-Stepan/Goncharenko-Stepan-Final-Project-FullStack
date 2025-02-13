import image from "../../assets/Background.svg";
import style from "./ErrorPage.module.css";

export const ErrorPage = () => {
  return (
    <div className={style.container}>
      <img src={image} alt="BackgroundPage" className={style.image} />
      <div className={style.textContainer}>
        <p className={style.h1Text}> Oops! Page Not Found (404 Error)</p>
        <p className={style.h2Text}>
          We're sorry, but the page you're looking for doesn't seem to exist. If
          you typed the URL manually, please double-check the spelling. If you
          clicked on a link, it may be outdated or broken.
        </p>
      </div>
    </div>
  );
};
