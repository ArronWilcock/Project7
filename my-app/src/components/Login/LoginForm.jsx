// Importing necessary modules and styles
import React, { useState, useContext } from "react"; // Importing React, useState, and useContext
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store, actions } from "../../store"; // Importing store and actions from the application's store

function LoginForm() {
  // Setting up state variables using useState hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate(); // Getting navigate function from react-router-dom
  const { dispatch } = useContext(store); // Getting the dispatch function from the global context store

  // Setting up state variables for error messages
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handling changes in the email input
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(""); // Clear email error
    updateFormCompletion();
  };

  // Handling changes in the password input
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(""); // Clear password error
    updateFormCompletion();
  };

  // Updating the form completion status
  const updateFormCompletion = () => {
    setIsFormComplete(email !== "" && password !== ""); // Form is complete if both email and password are filled
  };

  // Handling form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:3000/api/auth/login", formData)
      .then((response) => {
        // Handling successful sign-in
        console.log("Login successful:", response.data);
        dispatch({ type: actions.SET_USER_INFO, value: response.data }); // Dispatching action to set user info in the store
        dispatch({ type: actions.SET_LOGIN_STATE, value: true }); // Dispatching action to set login state in the store
        navigate("/");
      })
      .catch((error) => {
        // Handling login errors
        if (error.response.data.message === "Invalid email") {
          setEmailError("Invalid email");
        } else if (error.response.data.message === "Incorrect password") {
          setPasswordError("Incorrect password");
        } else {
          console.error("Login error:", error);
        }
      });
  };

  // Rendering the login form
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <div id="emailErrorMsg">{emailError}</div>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <div id="passwordErrorMsg">{passwordError}</div>

      <button type="submit" disabled={!isFormComplete}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;
