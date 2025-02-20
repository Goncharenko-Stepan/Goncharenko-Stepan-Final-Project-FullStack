import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  resetPassword,
  loginUser, // Убедись, что тут loginUser
} from "../actionCreators/authActionCreators.js";

const initialState = {
  status: "IDLE",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "REGISTERED";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "FAILED";
        console.log(action);
        state.error = action.error.message || "Registration failed";
      })

      // Исправлено на loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = "SUCCEEDED";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "FAILED";
        console.log(action);
        state.error = action.error.message || "Login failed";
      })

      .addCase(resetPassword.pending, (state) => {
        state.status = "LOADING";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, () => initialState)
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "FAILED";
        console.log(action);
        state.error = action.error.message || "Reset failed";
      });
  },
});

export default authSlice.reducer;
