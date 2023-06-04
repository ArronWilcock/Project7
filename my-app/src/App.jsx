import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './styles/pages/Home';
import LoginPage from './styles/pages/LoginPage';
import SignUpPage from './styles/pages/SignUpPage';


function App() {
  const isLoggedIn = false; // Replace with your actual login state or logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
