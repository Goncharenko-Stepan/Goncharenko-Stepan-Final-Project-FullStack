import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import {
  EditProfilePage,
  ErrorPage,
  ExplorePage,
  HomePage,
  LoginPage,
  PostPage,
  ProfilePage,
  RegisterPage,
  ResetPage,
} from "../pages";

// import MessagesPage from "../pages/";
import { MessagesPage } from "../pages/MessagePage/MessagePage.jsx";
import { MessagesMain } from "../components/MessagesMain/MessagesMain.jsx";

export const MainRouter = () => {
  const location = useLocation();
  const state = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        {/* Sing Up Роуты */}
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        Protected Routes
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/profile/:username/edit" element={<EditProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path=":username" element={<MessagesMain />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        Error Route
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/post/:postId" element={<PostModal />} />
        </Routes>
      )}
    </>
  );
};
