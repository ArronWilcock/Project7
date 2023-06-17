import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/icon-left-font.svg";
import "./banner.scss";

function Banner() {
  return (
    <div className="gm-banner">
      <img src={Logo} alt="Groupomania Logo" className="gm-logo" />
      <div className="right-nav">
        <ul>
          <li>
            <Link to="/login" className="nav-link">
              LOGIN
            </Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link">
              SIGN UP
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Banner;
