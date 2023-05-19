import "../styles/Banner.css";
import logo from "../assets/icon-left-font-monochrome-black.png";

function Banner() {
  return (
    <div className="gm-banner">
      <img src={logo} alt="Jungle House" className="gm-logo" />
      <div class="right-nav">
        <ul>
          <li>
            <a>SIGN UP</a>
          </li>
          <li>
            <a>LOGIN</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Banner;
