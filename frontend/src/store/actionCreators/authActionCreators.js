import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/apiUtils";

// Регистрация пользователя
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, fullName, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axiosInstance.post(
        `/auth/register`,
        { username, email, fullName, password },
        config
      );
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

// Логин пользователя
export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post(
        `/auth/login`,
        { usernameOrEmail, password },
        config
      );

      console.log("Ответ с бэкенда:", data);

      return data;
    } catch (error) {
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

// Сброс пароля
export const resetPassword = createAsyncThunk(
  "auth/reset",
  async ({ usernameOrEmail }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post(
        `/auth/reset`,
        { usernameOrEmail },
        config
      );
      return data;
    } catch (error) {
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
