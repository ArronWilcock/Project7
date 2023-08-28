import React from "react";
import "./LoadingSpinner.scss";

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
