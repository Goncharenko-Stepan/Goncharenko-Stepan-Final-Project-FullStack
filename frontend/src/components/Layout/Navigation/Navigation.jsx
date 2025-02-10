import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import links from "../navLinks";
import logo from "../../assets/logo.svg";
import ich from "../../assets/nav_icons/ich.png";
import default_profile_pic from "../../assets/default_profile_pic.png";
import { CreatePost } from "../CreatePost/CreatePost";
import { NotificationsModal } from "../NotificationsModal/NotificationsModal";
import { SearchModal } from "../SearchModal/SearchModal";
import { useFetchUserAfterReload } from "../../../utils/customHooks";
import styles from "./Navigation.module.css";

export const Navigation = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const user = useSelector((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const location = useLocation();

  useFetchUserAfterReload(user);

  return (
    <div className={styles.navContainer}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="logo" className={styles.logo} />
          <img src={ich} alt="logo small" className={styles.logoSmall} />
        </Link>
        <div className={styles.navLinks}>
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={styles.navItem}
              onMouseOver={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <img
                src={
                  hoveredLink === link.name || location.pathname === link.href
                    ? link.logoFill
                    : link.logo
                }
                alt={link.name}
                className={styles.navIcon}
              />
              <span className={styles.navText}>{link.name}</span>
            </Link>
          ))}
          <div
            className={styles.navItem}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <span className={styles.navText}>Search</span>
            {isSearchOpen && (
              <SearchModal
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />
            )}
          </div>
          <div
            className={styles.navItem}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <span className={styles.navText}>Notifications</span>
            {isNotificationsOpen && (
              <NotificationsModal
                isNotificationsOpen={isNotificationsOpen}
                setIsNotificationsOpen={setIsNotificationsOpen}
                notifications={user?.notifications}
              />
            )}
          </div>
          <div
            className={styles.navItem}
            onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
          >
            <span className={styles.navText}>Create</span>
            {isCreatePostOpen && (
              <CreatePost
                userId={user?._id}
                username={user?.username}
                profileImage={user?.profile_image}
                setIsCreatePostOpen={setIsCreatePostOpen}
              />
            )}
          </div>
          <Link to={`/profile/${user?.username}`} className={styles.navItem}>
            <img
              src={user?.profile_image || default_profile_pic}
              alt="Profile"
              className={styles.profileImage}
            />
            <span className={styles.navText}>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
