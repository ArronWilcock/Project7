import React, { useState, useContext } from "react";
import "./SignUp.scss";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { store, actions } from "../../store"



function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      .post("http://localhost:3000/api/auth/signup", formData)
      .then((response) => {
        // Handle successful sign-up
        console.log("Sign up successful:", response.data);
        dispatch({ type: actions.SET_USER_INFO, value: response.data });
        navigate('/');
      })
      .catch((error) => {
        // Handle sign-up error
        console.error("Sign up error:", error);
      });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <button type="submit" disabled={!isFormComplete}>
        Sign Up
      </button>
    </form>
  );
}

export default SignUpForm;
