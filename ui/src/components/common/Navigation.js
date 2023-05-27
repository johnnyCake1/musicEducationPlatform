import React, { useState } from "react";
import "./Navigation.css";
import Logo from "./Logo";
import ProfilePicture from "../Profile/components/profile_card/ProfilePicture";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";

function Navigation() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchBarContent, setSearchBarContent] = useState("");
  const [currentUser] = useLocalStorageState(null, "currentUser");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinks = (linkClass) => {
    return (
      <>
        <Link to="/dashboard" className={linkClass}>
          Dashboard
        </Link>
        <Link to="/my-courses" className={linkClass}>
          My courses
        </Link>
        <Link to="/my-learnings" className={linkClass}>
          My learnings
        </Link>
        <Link to="/courses" className={linkClass}>
          Explore
        </Link>
        <Link to="/chat" className={linkClass}>
          Chats
        </Link>
        <Link to="/storage" className={linkClass}>
          Storage
        </Link>
      </>
    );
  };

  const getProfileLinks = (linkClass) => {
    return (
      <>
        <ul>
          <li>
            <Link to={`/${currentUser.id}/profile`} className={linkClass}>
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${searchBarContent}`);
    }
  };

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
          onKeyDown={handleKeyDown}
        />
        <Link to={`/search/${searchBarContent}`}>
          <button className="search-btn">Search</button>
        </Link>
      </div>

      <div className="Navigation-links">{getNavLinks("nav-link")}</div>

      <div className="Navigation-profile">
        <div className="Navigation-profile-picture">
          <Link to={`/${currentUser.id}/profile`}>
            <ProfilePicture
              userId={currentUser.id}
              size={50}
              onClick={() => {}}
            />
          </Link>
        </div>
        <div className="Navigation-profile-dropdown">
          <div className="Navigation-profile-username">
            @{currentUser?.username}
          </div>
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
            <Link to={`/${currentUser.id}/profile`}>
              <ProfilePicture
                userId={currentUser.id}
                size={50}
                onClick={() => {}}
              />
              <div className="Navigation-profile-username">
                @{currentUser?.username}
              </div>
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
