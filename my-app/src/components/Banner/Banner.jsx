import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../images/icon-left-font.svg";
import "./banner.scss";

function Banner() {
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAccountPage = location.pathname === "/account";
  const isCreatePost = location.pathname === "/create-post";
  const isSinglePost = location.pathname.match(/^\/\d{1,}$/);

  return (
    <div className="gm-banner">
      <img src={Logo} alt="Groupomania Logo" className="gm-logo" />
      <div className="right-nav">
        <ul>
          {!isHomePage && !isAccountPage && !isCreatePost && !isSinglePost && (
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
            <>
              <li>
                <Link to="/create-post" className="nav-link">
                  POST
                </Link>
              </li>
              <li>
                <Link to="/account" className="nav-link">
                  ACCOUNT
                </Link>
              </li>
            </>
          )}
          {isAccountPage && (
            <>
              <li>
                <Link to="/create-post" className="nav-link">
                  POST
                </Link>
              </li>
              <li>
                <Link to="/" className="nav-link">
                  HOME
                </Link>
              </li>
            </>
          )}
          {isCreatePost && (
            <>
              <li>
                <Link to="/account" className="nav-link">
                  ACCOUNT
                </Link>
              </li>
              <li>
                <Link to="/" className="nav-link">
                  HOME
                </Link>
              </li>
            </>
          )}
          {isSinglePost && (
            <>
              <li>
                <Link to="/account" className="nav-link">
                  ACCOUNT
                </Link>
              </li>
              <li>
                <Link to="/" className="nav-link">
                  HOME
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Banner;
