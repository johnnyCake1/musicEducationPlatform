import React, { useEffect } from "react";
import "./Header.css";
import Button from "../../../common/Button";
import "../../../common/Button.css";
import guitarHeader from "../../assets/guitar_player_background.png";

import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from 'react-router-dom';

const Header = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="header">
      <div className="container header">
        <div className="header-left" data-aos="fade-right">
          <h1>
            <span>The best music resource</span>
            <span>for tutors and learners</span>
          </h1>
          <p className="u-text-small">
            Our music platform connects learners with experienced 
            music tutors from around the world, offering personalized 
            courses in a range of musical instruments and genres.
          </p>
          <div className="header-cta">
            <Link to={"/register"} style={{padding:10}} className={"my-btn-light"}  >
              Get Started
            </Link>
          </div>
        </div>
        <div className="header-right" data-aos="fade-left">
          <img src={guitarHeader} alt="guitar player smiling" />
        </div>
      </div>
    </section>
  );
};

export default Header;
