import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your actual login state or logic
  const setLoginState = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setLoginState={setLoginState} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
