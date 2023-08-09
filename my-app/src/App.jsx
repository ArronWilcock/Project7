import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { store } from "./store.js";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AccountPage from "./pages/Account";
import CreatePost from "./pages/CreatePost";
import OnePost from "./pages/SinglePost";
import PostList from "./components/Post/Posts";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const { state } = useContext(store);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/"
          element={state.userInfo ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={state.userInfo ? <PostList /> : <Navigate to="/login" />}
        />
        <Route
          path="/account"
          element={state.userInfo ? <AccountPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-post"
          element={state.userInfo ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          path="/:postId"
          element={state.userInfo ? <OnePost /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
