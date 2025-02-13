import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { fetchPost } from "../../store/actionCreators/postActionCreators";
import { PostMain } from "../../components/PostModal/PostMain/PostMain.jsx";
import { EditPostForm } from "../../components/PostModal/EditPostForm/EditPostForm.jsx";
import { PostMore } from "../../components/PostModal/PostMore/PostMore.jsx";
import { PhotoCarousel } from "../../components/PhotoCarousel/PhotoCarousel.jsx";
import styles from "./PostPage.module.css";

export const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const dispatch = useDispatch();
  const [postType, setPostType] = useState("preview");
  const moreRef = useRef(null);

  useEffect(() => {
    const fetchPostFunc = async () => {
      if (!postId) return;
      try {
        const result = await dispatch(fetchPost({ id: postId })).unwrap();
        setPost(result);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPostFunc();
  }, [postId, dispatch]);

  return (
    <>
      <div hidden ref={moreRef}>
        <PostMore
          modalRef={moreRef}
          postId={post?._id}
          setPostType={setPostType}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.postWrapper}>
          <div className={styles.imageContainer}>
            {post?.photos && post.photos.length > 1 ? (
              <PhotoCarousel
                photos={post.photos.map((photo) => photo.url || "")}
              />
            ) : (
              <img
                src={post?.photos?.[0]?.url}
                alt="Post"
                className={styles.postImage}
              />
            )}
          </div>
          {postType === "preview" ? (
            <div className={styles.postDetails}>
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
    </>
  );
};
