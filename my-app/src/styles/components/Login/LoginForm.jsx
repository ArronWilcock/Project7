import React, { useState } from "react";
import "./Login.scss";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);

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
    // Perform login logic
    console.log('Email:', email);
    console.log('Password:', password);
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
