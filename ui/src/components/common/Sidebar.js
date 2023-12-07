import React, { useState } from 'react';
import logo from './assets/MelodiousLogo.svg';

// import "./Navigation.css";
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Sidebar(props) {
  const { isOpen, toggleSidebar } = props;
  function isActive(match, activeClass) {
    return window.location.pathname === match ? activeClass : '';
  }
  const sidebarClass = isOpen ? 'sidebar sidebarOpen' : 'sidebar sidebarClosed';
  return (
    <div className={sidebarClass}>
      <div className="sidebar_inner" data-simplebar="init">
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
        <div className="sidebar_toggle" onClick={toggleSidebar}>
          <ion-icon
            name="close"
            class="sidebar_toggle_icon"
            role="img"
            size="large"
            aria-label="chevron back"
          ></ion-icon>
        </div>
        <div className="simplebar-wrapper">
          <div className="simplebar-height-auto-observer-wrapper">
            <div className="simplebar-height-auto-observer" />
          </div>
          <div className="simplebar-mask">
            <div
              className="simplebar-offset"
              style={{ right: '-15px', bottom: 0 }}
            >
              <div className="simplebar-content">
                <ul className="side-colored">
                  <li className={isActive('/dashboard', 'active')}>
                    <NavLink to="/dashboard">
                      <ion-icon
                        name="compass"
                        className="bg-gradient-to-br from-purple-300 p-1 rounded-md side-icon text-opacity-80 text-white to-blue-500 md hydrated"
                        role="img"
                        aria-label="compass"
                      ></ion-icon>
                      <span> &nbsp;Dashboard</span>
                    </NavLink>
                  </li>
                  <li className={isActive('/my-courses', 'active')}>
                    <NavLink to="/my-courses">
                      <ion-icon
                        name="play-circle"
                        className="bg-gradient-to-br from-yellow-300 p-1 rounded-md side-icon text-opacity-80 text-white to-red-500 md hydrated"
                        role="img"
                        aria-label="play circle"
                      ></ion-icon>
                      <span> &nbsp;My courses</span>
                    </NavLink>
                  </li>
                  <li className={isActive('/courses', 'active')}>
                    <NavLink to="/courses">
                      <ion-icon
                        name="albums"
                        className="bg-gradient-to-br from-green-300 p-1 rounded-md side-icon text-opacity-80 text-white to-green-500 md hydrated"
                        role="img"
                        aria-label="albums"
                      ></ion-icon>
                      <span> &nbsp;Explore </span>
                    </NavLink>
                  </li>
                  <li className={isActive('/my-learnings', 'active')}>
                    <NavLink to="/my-learnings">
                      <ion-icon
                        name="book"
                        className="bg-gradient-to-br from-yellow-300 p-1 rounded-md side-icon text-opacity-80 text-white to-red-500 md hydrated"
                        role="img"
                        aria-label="book"
                      ></ion-icon>
                      <span> &nbsp;My learnings </span>
                    </NavLink>
                  </li>
                  <li className={isActive('/storage', 'active')}>
                    <NavLink to="/storage">
                      <ion-icon
                        name="newspaper"
                        className="bg-gradient-to-br from-purple-300 p-1 rounded-md side-icon text-opacity-80 text-white to-blue-500 md hydrated"
                        role="img"
                        aria-label="newspaper"
                      ></ion-icon>
                      <span> &nbsp;Storage</span>
                    </NavLink>
                  </li>
                  <li className={isActive('/transactions', 'active')}>
                    <NavLink to="/transactions">
                      <ion-icon
                        name="cash"
                        className="bg-gradient-to-br from-purple-300 p-1 rounded-md side-icon text-opacity-80 text-white to-blue-500 md hydrated"
                        role="img"
                        aria-label="newspaper"
                      ></ion-icon>
                      <span> &nbsp;Transactions</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="simplebar-placeholder"
            style={{ width: 299, height: 1006 }}
          />
        </div>
        <div
          className="simplebar-track simplebar-horizontal"
          style={{ visibility: 'hidden' }}
        >
          <div
            className="simplebar-scrollbar"
            style={{
              transform: 'translate3d(0px, 0px, 0px)',
              visibility: 'hidden',
            }}
          />
        </div>
        <div
          className="simplebar-track simplebar-vertical"
          style={{ visibility: 'visible' }}
        >
          <div
            className="simplebar-scrollbar"
            style={{
              height: 205,
              transform: 'translate3d(0px, 0px, 0px)',
              visibility: 'visible',
            }}
          />
        </div>
      </div>
      <div
        className="side_overly"
        uk-toggle="target: #wrapper ; cls: is-collapse is-active"
      />
    </div>
  );
}

export default Sidebar;
