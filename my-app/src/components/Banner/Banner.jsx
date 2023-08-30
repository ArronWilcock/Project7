// Importing necessary components and styles
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Importing Link and useLocation from react-router-dom
import Logo from "../../images/icon-left-font.svg";
import "./banner.scss";

// Defining the Banner component
function Banner() {
  const location = useLocation(); // Getting the current location using useLocation hook from react-router-dom

  // Checking various conditions based on the current location
  const isHomePage = location.pathname === "/";
  const isAccountPage = location.pathname === "/account";
  const isCreatePost = location.pathname === "/create-post";
  const isSinglePost = location.pathname.match(/^\/\d{1,}$/);

  return (
    <div className="gm-banner">
      <img src={Logo} alt="Groupomania Logo" className="gm-logo" />
      <div className="right-nav">
        <ul>
          {/* Conditional rendering of navigation links based on location */}
          {!isHomePage && !isAccountPage && !isCreatePost && !isSinglePost && (
            // If not on homepage, account page, create post page, or single post page
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
            // If on homepage
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
            // If on account page
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
            // If on create post page
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
            // If on single post page
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
