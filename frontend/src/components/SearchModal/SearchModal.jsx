import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addSearchResult } from "../../store/slices/userSlice.js";
import {
  addUserToSearchResults,
  getAllUsersForSearch,
} from "../../utils/apiUtils/userApi.js";
import cancel from "../../assets/search_cancel.svg";
import arrow_back from "../../assets/arrow_back.svg";
import styles from "./SearchModal.module.css";

export const SearchModal = ({ isSearchOpen, setIsSearchOpen }) => {
  const [users, setUsers] = useState([]);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.user.search_results);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsersForSearch();
      setUsers(fetchedUsers);
    };
    if (users.length === 0) fetchUsers();
  }, [users]);

  const closeModal = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.length < 1) {
      setMatchingUsers([]);
      return;
    }
    if (users.length === 0) return;
    const regex = new RegExp(e.target.value, "i");
    setMatchingUsers(users.filter((user) => regex.test(user.username)));
  };

  const handleAddToSearch = async (user) => {
    await addUserToSearchResults(user.username);
    dispatch(addSearchResult(user));
  };

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div
        className={`${styles.modalContent} ${
          !isSearchOpen || isClosing ? styles.modalHidden : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <img src={arrow_back} alt="Back" onClick={closeModal} />
          <p>Search</p>
          <span></span>
        </div>
        <div className={styles.searchContainer}>
          <input
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search"
            className={styles.searchInput}
          />
          <img
            className={styles.searchIcon}
            src={cancel}
            alt="Cancel"
            onClick={() => {
              setSearchInput("");
              setMatchingUsers([]);
            }}
          />
        </div>
        <div className={styles.userList}>
          {matchingUsers.length > 0
            ? matchingUsers.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  key={user._id}
                  className={styles.userItem}
                  onClick={() => handleAddToSearch(user)}
                >
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <p>{user.username}</p>
                </Link>
              ))
            : searchResults.length > 0 &&
              searchResults
                .slice()
                .reverse()
                .slice(0, 5)
                .map((user) => (
                  <Link
                    to={`/profile/${user.username}`}
                    key={user._id}
                    className={styles.userItem}
                  >
                    <img
                      src={user.profile_image}
                      alt="Profile"
                      className={styles.profileImage}
                    />
                    <p>{user.username}</p>
                  </Link>
                ))}
        </div>
      </div>
    </div>
  );
};
