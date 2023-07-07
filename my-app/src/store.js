import React, { createContext, useReducer } from "react";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;
const actions = {
  SET_USER_INFO: "SET_USER_INFO",
};

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actions.SET_USER_INFO:
        const newState = { ...state, userInfo: action.value };
        return newState;
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, actions, StateProvider };
