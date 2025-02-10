import { createSelector } from "@reduxjs/toolkit";

const getFollowings = (state) => state.user.followings;

export const selectIfFollowing = createSelector(
  [getFollowings, (_, userId) => userId],
  (followings, userId) => {
    return followings.some((following) => following._id === userId);
  }
);
