import links from "../navLinks.js";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.linksContainer}>
        {links.map((link, index) => (
          <Link className={styles.link} key={index} to={link.href}>
            {link.text}
          </Link>
        ))}
      </div>
      <p className={styles.copyright}>© 2024 ICHgram</p>
    </footer>
  );
};
