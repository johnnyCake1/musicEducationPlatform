import React from "react";
import "./Footer.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFax,
  FaEnvelope,
} from "react-icons/fa";
import Logo from "../../../common/Logo";

const Footer = () => {
  return (
    <section id="footer">
      <div className="container footer">
        <div className="footer-box">
          <h4>Useful Links</h4>
          <div className="footer-links">
            <a className="link" href="#">&bull; Support</a>
            <a className="link" href="#">&bull; About</a>
            <a className="link" href="#">&bull; Learn</a>
            <a className="link" href="#">&bull; Hosting</a>
            <a className="link" href="#">&bull; Messenger</a>
          </div>
        </div>
        <div className="footer-box">
          <h4>Support</h4>
          <div className="footer-links">
            <a className="link" href="#">&bull; Support</a>
            <a className="link" href="#">&bull; About</a>
            <a className="link" href="#">&bull; Learn</a>
            <a className="link" href="#">&bull; Hosting</a>
            <a className="link" href="#">&bull; Messenger</a>
          </div>
        </div>
        <div className="footer-box">
          <h4>Contact Us</h4>
          <div className="footer-contact u-text-small">
            <p>
              <FaMapMarkerAlt /> &nbsp; Address: My Imagination street
            </p>
            <p>
              <FaPhoneAlt /> &nbsp; Phone: +0123456789
            </p>
            <p>
              <FaFax /> &nbsp; Fax: +0123456789
            </p>
            <p>
              <FaEnvelope /> &nbsp; Email: info@melodious.com
            </p>
          </div>
        </div>
        <div className="footer-box">
          <Logo />
          <p className="u-text-small">&copy; Copyright 2023. melodiousPlatfrom.com</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
