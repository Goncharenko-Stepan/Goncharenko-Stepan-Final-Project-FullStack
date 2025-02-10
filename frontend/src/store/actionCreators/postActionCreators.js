import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/apiUtils";

// Создание поста
export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ photos, content }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Array.from(photos).forEach((photo) => {
        formData.append("photos", photo);
      });
      formData.append("content", content);
      const response = await axiosInstance.post(`/posts/create`, formData);
      return response.data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          rejectWithValue(error.message);
        }
      }
    }
  }
);

// Получение поста
export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/get/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  }
);

// Обновление поста
export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/posts/${id}`, { content });
      return response.data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  }
);
