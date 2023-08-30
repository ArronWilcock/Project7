import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { store } from "./store.js"; // Import the global store context
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AccountPage from "./pages/Account";
import CreatePost from "./pages/CreatePost";
import OnePost from "./pages/SinglePost";
import PostList from "./components/Post/Posts"; // Import the PostList component
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome CSS for icons

function App() {
  const { state } = useContext(store); // Get the authentication state from the global store context

  return (
    <Router>
      <Routes>
        {/* Route definitions */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Conditional routing based on authentication */}
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
