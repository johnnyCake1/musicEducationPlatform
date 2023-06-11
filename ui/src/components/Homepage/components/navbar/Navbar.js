import React, { useState } from "react";
import { AiOutlineBars } from "react-icons/ai";
import { RiCloseLine } from "react-icons/ri";
import Button from "../../../common/Button";
import Logo from "../../../common/Logo";
import "./Navbar.css";
import useLocalStorageState from "../../../../util/useLocalStorageState";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [jwt] = useLocalStorageState("", "jwt");
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleGetStarted = () => {
    console.log("zheee:", jwt, currentUser);
    if (!jwt || !currentUser) {
      navigate("/register");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="navbar container-fluid">
      <Logo />
      <menu>
        <ul
          className="nav-links"
          id={showMenu ? "nav-links-mobile" : "nav-links-mobile-hide"}
        >
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#cards-gallery">Courses</a>
          </li>
          <li>
            <a href="#testimonials">Feedbacks</a>
          </li>
          <li className="nav-btn">
            <Button
              text={currentUser?"Dashboard":"Get Started"}
              btnClass={"my-btn-dark"}
              onClick={handleGetStarted}
            />
          </li>
        </ul>
      </menu>
      <div className="menu-icons" onClick={toggleMenu}>
        {showMenu ? (
          <RiCloseLine color="#fff" size={30} />
        ) : (
          <AiOutlineBars color="#fff" size={27} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
