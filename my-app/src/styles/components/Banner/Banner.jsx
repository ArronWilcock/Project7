import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../images/icon-left-font.svg";
import "./banner.scss";

function Banner() {
  const location = useLocation();

  return (
    <div className="gm-banner">
      <img src={Logo} alt="Groupomania Logo" className="gm-logo" />
      <div className="right-nav">
        <ul>
          {location.pathname !== "/" && (
            <li>
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>
          )}
          {location.pathname !== "/login" && (
            <li>
              <Link to="/login" className="nav-link">
                LOGIN
              </Link>
            </li>
          )}
          {location.pathname !== "/signup" && (
            <li>
              <Link to="/signup" className="nav-link">
                SIGN UP
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Banner;
