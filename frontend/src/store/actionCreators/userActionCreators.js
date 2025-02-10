import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/apiUtils";

// Получения данных пользователя
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async ({ username }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.get(`/users/${username}`, config);
      return response.data[0];
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Редактирования профиля
export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (
    { profile_image, username, new_username, website, bio },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (profile_image) {
        formData.append("photo", profile_image[0]);
      }
      formData.append("new_username", new_username);
      formData.append("website", website);
      formData.append("bio", bio);

      const response = await axiosInstance.post(
        `/users/${username}/edit`,
        formData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
