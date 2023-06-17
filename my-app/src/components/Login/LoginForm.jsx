import React, { useState } from "react";
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ setLoginState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    updateFormCompletion();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
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
        // Handle successful sign-up
        console.log("Login successful:", response.data);
        setLoginState(true); // Update the login state
        navigate("/");
      })
      .catch((error) => {
        // Handle sign-up error
        console.error("Login error:", error);
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
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button type="submit" disabled={!isFormComplete}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;
