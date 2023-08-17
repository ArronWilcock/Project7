import React, { useState, useContext } from "react";
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store, actions } from "../../store";

function LoginForm({ setLoginState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(store);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError("");
    updateFormCompletion();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError("");
    updateFormCompletion();
  };

  const updateFormCompletion = () => {
    setIsFormComplete(email !== "" && password !== "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:3000/api/auth/login", formData)
      .then((response) => {
        // Handle successful sign-in
        console.log("Login successful:", response.data);
        dispatch({ type: actions.SET_USER_INFO, value: response.data });
        dispatch({ type: actions.SET_LOGIN_STATE, value: true });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.data.message === "Invalid email") {
          setEmailError("Invalid email");
        } else if (error.response.data.message === "Incorrect password") {
          setPasswordError("Incorrect password");
        } else {
          console.error("Login error:", error);
        }
      });
  };

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
