import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/actionCreators/userActionCreators";
import { axiosInstance } from "./apiUtils";
import { createPost } from "../store/actionCreators/postActionCreators";
import { addPost } from "../store/slices/userSlice";

// Хук для отслеживания ширины экрана

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
};

// Хук для загрузки пользователя после обновления страницы
export const useFetchUserAfterReload = (user) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (isChecking || !user.username) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      setIsChecking(true);
      try {
        const { data } = await axiosInstance.get("/auth/checkAccessToken");
        console.log("Username:", data.username);
        dispatch(fetchUser({ username: data.username }));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        } else {
          console.error("Ошибка проверки токена:", error);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkToken();
  }, [user, dispatch, navigate]);
};

// Хук для создания поста
export const useCreatePost = (userId, setIsCreatePostOpen) => {
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [creating, setCreating] = useState(false);

  const { status, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  // Обработчик загрузки файлов
  const handleFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length > 0) {
      const previewPromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
              resolve({
                url: reader.result,
                width: img.width,
                height: img.height,
              });
            };
          };
        });
      });

      Promise.all(previewPromises).then((previews) => {
        setPreviews(previews);
        setPhotos(files);
      });
    }
  };

  // Обработчик выбора эмодзи
  const onEmojiClick = (emojiData) => {
    setContent((prevContent) => prevContent + emojiData.emoji);
  };

  // Сброс формы
  const resetForm = () => {
    setContent("");
    setPhotos([]);
    setPreviews([]);
  };

  // Отправка поста
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.length === 0 || photos.length === 0) {
      alert("Please add content and photos before submitting.");
      return;
    }

    setCreating(true);

    try {
      const result = await dispatch(createPost({ photos, content })).unwrap();
      if (result && userId) {
        dispatch(addPost(result));
        setIsCreatePostOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setCreating(false);
    }
  };

  return {
    content,
    setContent,
    photos,
    previews,
    showEmojiPicker,
    setShowEmojiPicker,
    creating,
    status,
    error,
    handleFileChange,
    onEmojiClick,
    handleSubmit,
    resetForm,
  };
};

// Хук для прокрутки страницы вверх при загрузке
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
};

export default useScrollToTop;
