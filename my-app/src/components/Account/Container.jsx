import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { store, actions } from "../../store";
import axios from "axios";
import Options from "./Options";
import "./Container.scss";

function Container({ setLoginState }) {
  const { dispatch } = useContext(store);
  const navigate = useNavigate();
  const userId = useContext(store).state.userInfo.userId;

  const handleLogout = () => {
    // Perform any necessary cleanup or API requests for logout

    // Reset the user information in the store
    dispatch({ type: actions.SET_USER_INFO, value: null });

    // Navigate to the login or home page (whichever is appropriate for your app)
    navigate("/login"); // Replace "/login" with your desired route
  };

  const handleDeleteAccount = (event) => {
    event.preventDefault();

    axios
      .post(`"http://localhost:3000/api/auth/${userId}"`)
      .then((response) => {
        // Handle successful sign-in
        console.log("Account removed successfully:");
        setLoginState(false); // Update the login state
        navigate("/login");
      })
      .catch((error) => {
        // Handle sign-in error
        console.error("Account deletion error:", error);
      });
    // Handle delete account functionality
  };

  return (
    <div className="account-container">
      <Options title="Log Out" buttonText="Log Out" onClick={handleLogout} />
      <Options
        title="Delete Account"
        buttonText="Delete Account"
        onClick={handleDeleteAccount}
      />
    </div>
  );
}

export default Container;