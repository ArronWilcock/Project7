import React, { useState, useContext } from "react";
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store, actions } from "../../store";

function LoginForm({ setLoginState }) {
  const [email, setEmail] = useState("arron.wilcock@outlook.com");
  const [password, setPassword] = useState("1234");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(store);

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
        // Handle successful sign-in
        console.log("Login successful:", response.data);
        dispatch({ type: actions.SET_USER_INFO, value: response.data });
        dispatch({ type: actions.SET_LOGIN_STATE, value: true });
        navigate("/");
      })
      .catch((error) => {
        // Handle sign-in error
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
