import React, { useState } from "react";
// import "./Navigation.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  function isActive(match, activeClass) {
    return window.location.pathname === match ? activeClass : '';
  }
  return (
    <div className="sidebar">
      <div className="sidebar_inner" data-simplebar="init">
        <div className="simplebar-wrapper" style={{ margin: "-72px -12px 0px" }}>
          <div className="simplebar-height-auto-observer-wrapper">
            <div className="simplebar-height-auto-observer" />
          </div>
          <div className="simplebar-mask">
            <div
              className="simplebar-offset"
              style={{ right: "-15px", bottom: 0 }}
            >
              <div
                className="simplebar-content"
                style={{
                  padding: "72px 12px 0px",
                  height: "100%",
                  overflow: "hidden scroll"
                }}
              >
                <ul className="side-colored">
                  <li className={isActive('/dashboard', 'active')}>
                    <NavLink to="/dashboard" >
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
                    <NavLink to="/my-courses" >
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
                    <NavLink to="/courses" >
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
                    <NavLink to="/my-learnings" >
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
                    <NavLink to="/storage" >
                      <ion-icon
                        name="newspaper"
                        className="bg-gradient-to-br from-purple-300 p-1 rounded-md side-icon text-opacity-80 text-white to-blue-500 md hydrated"
                        role="img"
                        aria-label="newspaper"
                      ></ion-icon>
                      <span> &nbsp;Storage</span>
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
          style={{ visibility: "hidden" }}
        >
          <div
            className="simplebar-scrollbar"
            style={{
              transform: "translate3d(0px, 0px, 0px)",
              visibility: "hidden"
            }}
          />
        </div>
        <div
          className="simplebar-track simplebar-vertical"
          style={{ visibility: "visible" }}
        >
          <div
            className="simplebar-scrollbar"
            style={{
              height: 205,
              transform: "translate3d(0px, 0px, 0px)",
              visibility: "visible"
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