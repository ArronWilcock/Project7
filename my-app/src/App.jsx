import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AccountPage from "./pages/Account";
import CreatePost from "./pages/CreatePost";
import OnePost from "./pages/SinglePost";
import PostList from "./components/Post/Posts";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage for login status
    const isLoggedInStatus = localStorage.getItem("isLoggedIn");
    if (isLoggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const setLoginState = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    localStorage.setItem("isLoggedIn", loggedIn ? "true" : "false");
  };

  // TODO send user to login page if loggedin = false

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setLoginState={setLoginState} />}
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<PostList />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/:postId" element={<OnePost />} />
      </Routes>
    </Router>
  );
}

export default App;
