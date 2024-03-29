// Importing necessary modules and styles
import React, { useState, useContext } from "react"; // Importing React, useState, and useContext
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
import axios from "axios"; // Importing axios for making HTTP requests
import { store, actions } from "../../store"; // Importing store and actions from the application's store
import "./SignUp.scss";
// Regular expressions for validation
const validName = new RegExp(/^([^0-9]*)$/g);
const validEmail = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g);
const validPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/); // At least 8 characters, including letters and numbers

function SignUpForm() {
  // Setting up state variables using useState hook
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate(); // Using the useNavigate hook for navigation
  const { dispatch } = useContext(store); // Using the dispatch function from the global context store

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handling changes for first name input
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    validateFirstName(event.target.value);
    updateFormCompletion();
  };

  // Handling changes for last name input
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    validateLastName(event.target.value);
    updateFormCompletion();
  };

  // Handling changes for email input
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    validateEmail(event.target.value);
    updateFormCompletion();
  };

  // Handling changes for password input
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    validatePassword(event.target.value);
    updateFormCompletion();
  };

  // Updating the form completion status
  const updateFormCompletion = () => {
    setIsFormComplete(
      (prevState) => email !== "" && password !== "" && !prevState.passwordError
    );
  };

  // Validating first name
  const validateFirstName = (value) => {
    if (value === "") {
      setFirstNameError("Required field");
    } else if (!value.match(validName)) {
      setFirstNameError("Invalid Name");
    } else {
      setFirstNameError("");
    }
  };

  // Validating last name
  const validateLastName = (value) => {
    if (value === "") {
      setLastNameError("Required field");
    } else if (!value.match(validName)) {
      setLastNameError("Invalid Name");
    } else {
      setLastNameError("");
    }
  };

  // Validating email
  const validateEmail = (value) => {
    if (value === "") {
      setEmailError("Required field");
    } else if (!value.match(validEmail)) {
      setEmailError("Invalid Email");
    } else {
      setEmailError("");
    }
  };

  // Validating password
  const validatePassword = (value) => {
    if (value === "") {
      setPasswordError("Required field");
    } else if (!value.match(validPassword)) {
      setPasswordError(
        "Password must be at least 8 characters and include letters and numbers"
      );
      setIsFormComplete(
        (prevState) => prevState.email !== "" && prevState.password !== ""
      );
    } else {
      setPasswordError("");
      updateFormCompletion();
    }
  };

  // Handling form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation
    validateFirstName(firstName);
    validateLastName(lastName);
    validateEmail(email);
    validatePassword(password);

    if (firstNameError || lastNameError || emailError || passwordError) {
      return; // Don't proceed with submission if validation fails
    }

    // Creating form data
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    // Sending a POST request to sign up
    axios
      .post("http://localhost:3000/api/auth/signup", formData)
      .then((response) => {
        // Handle successful sign-up
        console.log("Sign up successful:", response.data);
        dispatch({ type: actions.SET_USER_INFO, value: response.data });
        navigate("/login");
      })
      .catch((error) => {
        if (error.response.data.message === "Email already registered") {
          setEmailError("Email already registered");
        } else {
          // Handle sign-up error
          console.error("Sign up error:", error);
        }
      });
  };

  // Rendering the component
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <div id="firstNameErrorMsg">{firstNameError}</div>

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <div id="lastNameErrorMsg">{lastNameError}</div>

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
        required
      />
      <div id="passwordErrorMsg">{passwordError}</div>

      <button type="submit" disabled={!isFormComplete}>
        Sign Up
      </button>
    </form>
  );
}

export default SignUpForm;
