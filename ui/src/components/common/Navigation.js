import React, { useState } from 'react';
// import "./Navigation.css";
import Logo from './Logo';
import ProfilePicture from '../Profile/components/profile_card/ProfilePicture';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import logo from './assets/MelodiousLogo.svg';

function Navigation({ toggleSidebar }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchBarContent, setSearchBarContent] = useState('');
  const [currentUser] = useLocalStorageState(null, 'currentUser');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinks = (linkClass) => {
    return (
      <>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/my-courses">My courses</Link>
        <Link to="/my-learnings">My learnings</Link>
        <Link to="/courses">Explore</Link>
        <Link to="/chat">Chats</Link>
        <Link to="/storage">Storage</Link>
      </>
    );
  };

  const getProfileLinks = (linkClass) => {
    return (
      <>
        <ul>
          <li>
            <Link to={`/${currentUser.id}/profile`}>My profile</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/logout">Log out</Link>
          </li>
        </ul>
      </>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchBarContent != ''
        ? navigate(`/search/${searchBarContent}`)
        : alert('Search could not be empty');
    }
  };

  return (
    <header
      className="is-transparent border-b backdrop-filter backdrop-blur-2xl uk-sticky uk-sticky-fixed"
      uk-sticky="cls-inactive: is-dark is-transparent border-b"
      style={{ position: 'sticky', top: '0px' }}
    >
      <div className="header_inner">
        <div className="left-side">
          {/* Logo */}
          <div id="logo">
            <Link to="/">
              <img
                src={logo}
                alt="Melodious logo"
                className="logo"
                style={{ filter: 'invert(1)' }}
              />
            </Link>
          </div>
          {/* icon menu for mobile */}
          <div
            onClick={() => toggleSidebar()}
            className="triger"
            uk-toggle="target: #wrapper ; cls: is-active"
          ></div>
        </div>
        <div className="right-side">
          {/* Header search box  */}
          <div className="header_search">
            <i style={{ fontSize: '16px' }}>
              <ion-icon name="search" />
            </i>
            <input
              onChange={(e) => setSearchBarContent(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              className="form-control"
              placeholder="Search"
              autoComplete="off"
            />
            <button
              onClick={() => {
                searchBarContent != ''
                  ? navigate(`/search/${searchBarContent}`)
                  : alert('Search could not be empty');
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
          <div>
            {/* messages */}
            <Link className="header_widgets" to="/chat">
              <ion-icon
                name="mail-outline"
                className="is-icon md hydrated"
                role="img"
                size="large"
                aria-label="notifications outline"
              />
            </Link>

            {/* profile */}
            <span
              onClick={() => toggleMenu()}
              aria-expanded="false"
              className={isMenuOpen ? 'uk-open' : ''}
            >
              <ProfilePicture
                imageSrc={currentUser.img_url}
                onClick={() => {}}
                size={30}
              />
            </span>
            <div
              uk-drop="mode: click;offset:5"
              className={
                isMenuOpen
                  ? 'header_dropdown profile_dropdown uk-drop  uk-open'
                  : 'header_dropdown profile_dropdown uk-drop '
              }
            >
              <ul>
                <li>
                  <Link to={`/${currentUser.id}/profile`}>
                    <div className="user_avatar">
                      <ProfilePicture
                        imageSrc={currentUser.img_url}
                        onClick={() => {}}
                      />
                    </div>
                    <div className="user_name">
                      <div>
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <span> @{currentUser.username} </span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/chat">
                    <ion-icon
                      name="chatbubbles-outline"
                      className="is-icon md hydrated"
                      role="img"
                      aria-label="settings outline"
                    />
                    Messages
                  </Link>
                </li>
                <li>
                  <hr />
                </li>
                <li>
                  <Link to={`/${currentUser.id}/profile`}>
                    <ion-icon
                      name="person-circle-outline"
                      className="is-icon md hydrated"
                      role="img"
                      aria-label="person circle outline"
                    />
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/settings">
                    <ion-icon
                      name="settings-outline"
                      className="is-icon md hydrated"
                      role="img"
                      aria-label="settings outline"
                    />
                    Account Settings
                  </Link>
                </li>

                <li>
                  <hr />
                </li>

                <li>
                  <Link to="/logout">
                    <ion-icon
                      name="log-out-outline"
                      className="is-icon md hydrated"
                      role="img"
                      aria-label="log out outline"
                    />
                    Log Out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
