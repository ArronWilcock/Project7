import React, { createContext, useReducer } from "react";

const initialState = JSON.parse(localStorage.getItem("state")) || {};
const store = createContext(initialState);
const { Provider } = store;
const actions = {
  SET_USER_INFO: "SET_USER_INFO",
  SET_LOGIN_STATE: "SET_LOGIN_STATE",
};

const updateState = (newState) => {
  localStorage.setItem("state", JSON.stringify(newState));
  return newState;
};

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actions.SET_USER_INFO:
        return updateState({ ...state, userInfo: action.value });
      case actions.SET_LOGIN_STATE:
        return updateState({ ...state, loginState: action.value });
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, actions, StateProvider };
