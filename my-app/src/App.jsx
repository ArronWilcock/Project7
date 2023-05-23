import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './styles/pages/LoginPage';
import SignUpPage from './styles/pages/SignUpPage';
// import other components/pages if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Define other routes and components/pages here */}
      </Routes>
    </Router>
  );
}

export default App;
