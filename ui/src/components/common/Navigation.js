import React, { useState } from "react";
import "./Navigation.css";
import Logo from "./Logo";
import ProfilePicture from "../Profile/components/profile_card/ProfilePicture";
import { Link } from "react-router-dom";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinks = (linkClass) => {
    return (
      <>
        <Link to="/dashboard" className={linkClass}>
          Dashboard
        </Link>
        <Link to="/courses" className={linkClass}>
          My courses
        </Link>
        <Link to="/chat" className={linkClass}>
          Chats
        </Link>
        <Link to="/saved" className={linkClass}>
          Saved
        </Link>
      </>
    );
  };

  const getProfileLinks = (linkClass) => {
    return (
      <>
        <ul>
          <li>
            <Link to="/profile" className={linkClass}>
              My profile
            </Link>
          </li>
          <li>
            <Link to="/settings" className={linkClass}>
              Settings
            </Link>
          </li>
          <li>
            <Link to="/logout" className={linkClass}>
              Log out
            </Link>
          </li>
        </ul>
      </>
    );
  };

  const [searchBarContent, setSearchBarContent] = useState("");
  return (
    <nav className="Navigation">
      <div className="Navigation-logo">
        <Logo />
      </div>

      <div className="Navigation-search">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchBarContent(e.target.value)}
        />
        <Link to={`/search/${searchBarContent}`}>
          <button className="search-btn">Search</button>
        </Link>
      </div>

      <div className="Navigation-links">{getNavLinks("nav-link")}</div>

      <div className="Navigation-profile">
        <div className="Navigation-profile-picture">
          <Link to="/profile">
            <ProfilePicture size={50} onClick={() => {}} />
          </Link>
        </div>
        <div className="Navigation-profile-dropdown">
          <div className="Navigation-profile-username">Username</div>
          {getProfileLinks("nav-link")}
        </div>
      </div>

      <div className="Navigation-menu-icon" onClick={toggleMenu}>
        <i className="fas fa-bars" style={{ color: "white" }}></i>
      </div>

      {isMenuOpen && (
        <div className="Navigation-menu-panel">
          {getNavLinks("nav-link")}
          <div className="Navigation-profile-picture">
            <Link to="/profile">
              <ProfilePicture size={50} onClick={() => {}} />
            </Link>
          </div>
          <div className="Navigation-profile-dropdown">
            {getProfileLinks("nav-link")}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
