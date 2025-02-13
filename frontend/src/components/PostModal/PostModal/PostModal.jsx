import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost } from "../../../store/actionCreators/postActionCreators.js";
import moreIcon from "../../../assets/more.svg";
import arrowBackIcon from "../../../assets/arrow_back.svg";
import { PostMain } from "../PostMain/PostMain.js";
import { EditPostForm } from "../EditPostForm/EditPostForm.jsx";
import { PhotoCarousel } from "../../PhotoCarousel/PhotoCarousel.jsx";
import { PostModalSkeleton } from "../../skeletons/PostModalSkeleton.js";
import { PostMore } from "../PostMore/PostMore.jsx";
import styles from "./PostModal.module.css";

export const PostModal = () => {
  const [post, setPost] = useState(null);
  const [postType, setPostType] = useState("preview");
  const moreRef = useRef(null);
  const { _id } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { postId } = useParams();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchPostFunc = async () => {
      if (!postId) return;
      const result = await dispatch(fetchPost({ id: postId })).unwrap();
      setPost(result);
    };
    fetchPostFunc();
  }, [postId, dispatch]);

  if (!post) return <PostModalSkeleton />;

  return (
    <>
      {post?.author?._id === _id && (
        <div hidden ref={moreRef}>
          <PostMore
            modalRef={moreRef}
            postId={post?._id}
            setPostType={setPostType}
          />
        </div>
      )}
      <div className={styles.modalBackground} onClick={closeModal}>
        <div
          className={styles.modalContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <img
              src={arrowBackIcon}
              alt="Back"
              className={styles.icon}
              onClick={closeModal}
            />
            {post?.author.username}
            {post?.author?._id !== _id ? (
              <img
                src={moreIcon}
                alt="More"
                className={styles.icon}
                onClick={() =>
                  moreRef.current && (moreRef.current.hidden = false)
                }
              />
            ) : null}
          </div>
          <div className={styles.modalContent}>
            <div className={styles.imageContainer}>
              {post?.photos?.length > 1 ? (
                <PhotoCarousel
                  photos={post.photos.map((photo) => photo.url || "")}
                />
              ) : (
                <img
                  src={post?.photos[0]?.url}
                  alt="Post"
                  className={styles.image}
                />
              )}
            </div>
            {postType === "preview" ? (
              <div className={styles.postMainContainer}>
                <PostMain post={post} setPost={setPost} moreRef={moreRef} />
              </div>
            ) : (
              <EditPostForm
                postContent={post?.content}
                postId={post?._id}
                setPost={setPost}
                setPostType={setPostType}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
