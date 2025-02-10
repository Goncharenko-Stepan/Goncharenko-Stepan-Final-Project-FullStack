import { createSlice } from "@reduxjs/toolkit";

import {
  editProfile,
  fetchUser,
} from "../actionCreators/userActionCreators.js";

const initialState = {
  _id: "",
  username: "",
  email: "",
  full_name: "",
  profile_image: "",
  bio: "",
  website: "",
  posts: [],
  notifications: [],
  followers: [],
  followings: [],
  search_results: [],
  status: "IDLE",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    addFollowing: (state, action) => {
      state.followings.push(action.payload);
    },
    removeFollowing: (state, action) => {
      state.followings = state.followings.filter((f) => {
        return f._id !== action.payload._id;
      });
    },
    addSearchResult: (state, action) => {
      state.search_results.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "FETCHED";
        state.error = null;
        state._id = action.payload._id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.full_name = action.payload.full_name;
        state.profile_image = action.payload.profile_image;
        state.bio = action.payload.bio;
        state.website = action.payload.website;
        state.posts = action.payload.posts;
        state.notifications = action.payload.notifications;
        state.followers = action.payload.followers;
        state.followings = action.payload.followings;
        state.search_results = action.payload.search_results;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = action.error.message || "Registration failed";
      })
      .addCase(editProfile.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = "EDITED";
        state.error = null;
        state.username = action.payload.username;
        state.profile_image = action.payload.profile_image;
        state.bio = action.payload.bio;
        state.website = action.payload.website;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = "FAILED";
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export const { addPost, addFollowing, removeFollowing, addSearchResult } =
  userSlice.actions;
export default userSlice.reducer;
