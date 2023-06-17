import React from "react";
import LoginForm from "../components/Login/LoginForm";
import Banner from "../components/Banner/Banner";

function LoginPage({ setLoginState }) {
  return (
    <div>
      <Banner />
      <LoginForm setLoginState={setLoginState} />
    </div>
  );
}

export default LoginPage;
