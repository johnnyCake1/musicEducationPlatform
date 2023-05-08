import { Link } from "react-router-dom";
import "./Logo.css";
import logo from "./assets/MelodiousLogo.svg";

const Logo = ({ w, h }) => {
  let width = w ?? "200px";
  let height = h ?? "80px";
  return (
    <Link to="/">
      <img
        src={logo}
        alt="Melodious logo"
        className="logo"
        style={{ width: width, height: height }}
      />
    </Link>
  );
};

export default Logo;
