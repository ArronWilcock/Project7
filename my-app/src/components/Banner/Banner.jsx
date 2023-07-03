import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../images/icon-left-font.svg";
import "./banner.scss";

function Banner() {
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAccountPage = location.pathname === "/account";

  return (
    <div className="gm-banner">
      <img src={Logo} alt="Groupomania Logo" className="gm-logo" />
      <div className="right-nav">
        <ul>
          {!isHomePage && !isAccountPage && (
            <>
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
            </>
          )}
          {isHomePage && (
            <li>
              <Link to="/account" className="nav-link">
                ACCOUNT
              </Link>
            </li>
          )}
          {isAccountPage && (
            <li>
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Banner;
