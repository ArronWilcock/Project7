import React, { createContext, useReducer } from "react";

// Load the initial state from localStorage or an empty object
const initialState = JSON.parse(localStorage.getItem("state")) || {};

// Create the context for the store
const store = createContext(initialState);

// Extract the Provider component from the context
const { Provider } = store;

// Define action types for dispatching
const actions = {
  SET_USER_INFO: "SET_USER_INFO",
  SET_LOGIN_STATE: "SET_LOGIN_STATE",
};

// Function to update the state in localStorage and return the new state
const updateState = (newState) => {
  localStorage.setItem("state", JSON.stringify(newState));
  return newState;
};

// Define a StateProvider component to manage state and dispatch
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actions.SET_USER_INFO:
        return updateState({ ...state, userInfo: action.value });
      case actions.SET_LOGIN_STATE:
        return updateState({ ...state, loginState: action.value });
      default:
        throw new Error("Unhandled action type");
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, actions, StateProvider };
