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
                    <NavLink activeClassName="active" to="/dashboard" >
                      <ion-icon
                        name="compass"
                        class="bg-gradient-to-br from-purple-300 p-1 rounded-md side-icon text-opacity-80 text-white to-blue-500 md hydrated"
                        role="img"
                        aria-label="compass"
                      ></ion-icon>
                      <span> Dashboard</span>
                    </NavLink>
                    
                  </li>
                  <li className={isActive('/my-courses', 'active')}>
                    <NavLink activeClassName="active" to="/my-courses" >
                      <ion-icon
                        name="play-circle"
                        class="bg-gradient-to-br from-yellow-300 p-1 rounded-md side-icon text-opacity-80 text-white to-red-500 md hydrated"
                        role="img"
                        aria-label="play circle"
                      ></ion-icon>
                      <span> My courses</span>
                    </NavLink>
                  </li>
                  <li className={isActive('/courses', 'active')}>
                    <NavLink activeClassName="active" to="/courses" >
                      <ion-icon
                        name="albums"
                        class="bg-gradient-to-br from-green-300 p-1 rounded-md side-icon text-opacity-80 text-white to-green-500 md hydrated"
                        role="img"
                        aria-label="albums"
                      ></ion-icon>
                      <span> Explore </span>
                    </NavLink>
                  </li>
                  <li className={isActive('/my-learnings', 'active')}>
                    <NavLink activeClassName="active" to="/my-learnings" >
                      <ion-icon
                        name="book"
                        class="bg-gradient-to-br from-yellow-300 p-1 rounded-md side-icon text-opacity-80 text-white to-red-500 md hydrated"
                        role="img"
                        aria-label="book"
                      ></ion-icon>
                      <span> My learnings </span>
                    </NavLink>
                  </li>
                  <li className={isActive('/storage', 'active')}>
                    <NavLink activeClassName="active" to="/storage" >
                      <ion-icon
                        name="newspaper"
                        class="bg-gradient-to-br from-purple-300 p-1 rounded-md side-icon text-opacity-80 text-white to-blue-500 md hydrated"
                        role="img"
                        aria-label="newspaper"
                      ></ion-icon>
                      <span> Storage</span>
                    </NavLink>
                  </li>
                </ul>
                <ul className="side_links" data-sub-title="Pages">
                  <li>
                    <a href="page-pricing.html">
                      
                      <ion-icon
                        name="card-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="card outline"
                      />
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="page-help.html">
                      
                      <ion-icon
                        name="information-circle-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="information circle outline"
                      />
                      Help
                    </a>
                  </li>
                  <li>
                    <a href="page-faq.html">
                      
                      <ion-icon
                        name="albums-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="albums outline"
                      />
                      Faq
                    </a>
                  </li>
                  <li>
                    <a href="page-forum.html">
                      
                      <ion-icon
                        name="chatbubble-ellipses-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="chatbubble ellipses outline"
                      />
                      Forum <span className="soon">new</span>
                    </a>
                  </li>
                  <li>
                    <a href="pages-cart.html">
                      
                      <ion-icon
                        name="receipt-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="receipt outline"
                      />
                      Cart list
                    </a>
                  </li>
                  <li>
                    <a href="pages-account-info.html">
                      
                      <ion-icon
                        name="reader-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="reader outline"
                      />
                      Billing
                    </a>
                  </li>
                  <li>
                    <a href="pages-payment-info.html">
                      
                      <ion-icon
                        name="wallet-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="wallet outline"
                      />
                      Payments
                    </a>
                  </li>
                  <li>
                    <a href="page-term.html">
                      
                      <ion-icon
                        name="document-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="document outline"
                      />
                      Term
                    </a>
                  </li>
                  <li>
                    <a href="page-privacy.html">
                      
                      <ion-icon
                        name="document-text-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="document text outline"
                      />
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="page-setting.html">
                      
                      <ion-icon
                        name="settings-outline"
                        class="side-icon md hydrated"
                        role="img"
                        aria-label="settings outline"
                      />
                      Setting
                    </a>
                  </li>
                  <li>
                    <a href="#"> Development</a>
                    <ul>
                      <li>
                        <a href="development-elements.html"> Elements</a>
                      </li>
                      <li>
                        <a href="development-components.html"> Compounents </a>
                      </li>
                      <li>
                        <a href="development-plugins.html"> Plugins </a>
                      </li>
                      <li>
                        <a href="development-icons.html"> Icons </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#"> Authentication</a>
                    <ul>
                      <li>
                        <a href="form-login.html">form login </a>
                      </li>
                      <li>
                        <a href="form-register.html">form register</a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div className="side_foot_links">
                  <a href="#">About</a>
                  <a href="#">Blog </a>
                  <a href="#">Careers</a>
                  <a href="#">Support</a>
                  <a href="#">Contact Us </a>
                  <a href="#">Developer</a>
                  <a href="#">Terms of service</a>
                </div>
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