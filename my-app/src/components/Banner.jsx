import "../styles/Banner.scss";
import logo from "../assets/icon-left-font.svg";

function Banner() {
  return (
    <div className="gm-banner">
      <img src={logo} alt="Groupomania Logo" className="gm-logo" />
      <div className="right-nav">
        <ul>
          <li>
            <a href="index.html">LOGIN</a>
          </li>
          <li>
            <a href="index.html">SIGN UP</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Banner;
