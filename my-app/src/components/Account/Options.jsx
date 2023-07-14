
import React from "react";
import "./Options.scss"

const Options = ({ title, buttonText, onClick }) => {
  return (
    <div className="option-container">
      <h2 className="option-container__title">{title}</h2>
      <button type ="submit" className="option-container__btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default Options;
