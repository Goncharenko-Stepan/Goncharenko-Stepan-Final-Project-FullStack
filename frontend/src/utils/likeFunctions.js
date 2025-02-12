import like from "../assets/reavtionIcons/like.svg";
import liked from "../assets/reavtionIcons/liked.svg";
import { likePost, unLikePost } from "./apiUtils/postApi";
import { unLikeComment, likeComment } from "./apiUtils/commentApi";

export const onLikeComment = async (e, commentId, post, setPost) => {
  const target = e.target;
  if (!target) return;

  if (target.src === like) {
    await likeComment(commentId);

    // Update the UI immediately after liking the comment
    if (!post) return;
    const updatedPost = { ...post };
    const updatedComment = updatedPost?.comments.find(
      (c) => c._id === commentId
    );

    if (updatedComment) {
      // Create a new comment object with the updated like_count
      const modifiedComment = {
        ...updatedComment,
        like_count: updatedComment.like_count + 1,
      };

      // Replace the old comment with the modified one
      updatedPost.comments = updatedPost.comments.map((comment) =>
        comment._id === commentId ? modifiedComment : comment
      );
    }
    setPost(updatedPost);

    target.src = liked;
  } else {
    await unLikeComment(commentId);

    // Update the UI immediately after unliking the comment
    if (!post) return;
    const updatedPost = { ...post };
    const updatedComment = updatedPost?.comments.find(
      (c) => c._id === commentId
    );
    if (updatedComment) {
      // Create a new comment object with the updated like_count
      const modifiedComment = {
        ...updatedComment,
        like_count: updatedComment.like_count - 1,
      };

      // Replace the old comment with the modified one
      updatedPost.comments = updatedPost.comments.map((comment) =>
        comment._id === commentId ? modifiedComment : comment
      );
    }
    setPost(updatedPost);

    target.src = like;
  }
};

export const onLikePost = async (e, postId, post, setPost) => {
  const target = e.target;
  if (target.src === like) {
    await likePost(postId);

    // Update the UI immediately after liking the post
    if (post) {
      setPost({ ...post, like_count: post.like_count + 1 });
    }

    target.src = liked;
  } else {
    await unLikePost(postId);

    // Update the UI immediately after unliking the post
    if (post) {
      setPost({ ...post, like_count: post.like_count - 1 });
    }

    target.src = like;
  }
};

export const onLikePostFromHomepage = async (e, postId, setPosts) => {
  const target = e.target;
  if (target.src === like) {
    await likePost(postId);

    // Update the UI immediately after liking the post
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, like_count: post.like_count + 1 }
          : post
      )
    );

    target.src = liked;
  } else {
    await unLikePost(postId);

    // Update the UI immediately after unliking the post
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, like_count: post.like_count - 1 }
          : post
      )
    );

    target.src = like;
  }
};

export const isLikedByUser = (likedBy, userId) => {
  if (!userId) return;
  const res = likedBy.filter((like) => like.user === userId);
  return res.length > 0;
};
