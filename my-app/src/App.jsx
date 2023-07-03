import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

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

  if (isLoggedIn === false) {
    // Show a loading indicator or other appropriate component
    return <div>Loading...</div>;
  }

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
      </Routes>
    </Router>
  );
}

export default App;
