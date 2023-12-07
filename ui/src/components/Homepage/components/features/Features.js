import React, { useEffect } from "react";
import "./Features.css";

import soundWaves from "../../assets/soundWaves.svg";

import AOS from "aos";
import "aos/dist/aos.css";
import PictureTile from "./PictureTile";

const Features = ({ heading, descriptions, fourIcons }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="features">
      <div className="container features">
        <div className="features-content">
          <div className="features-left" data-aos="fade-right">
            <PictureTile images={fourIcons} />
          </div>
          <div className="features-right" data-aos="fade-left">
            {/**/}
            <div className="feature">
              <div className="feature-text">
                <div className="title" data-aos="fade-up">
                  <h2>
                    <img src={soundWaves} alt="sound waves" />
                    &nbsp;&nbsp;&nbsp;{heading}
                  </h2>
                </div>
                {descriptions.map(description => {
                  return <>
                      <p className="u-text-small">
                      {description}
                      </p>
                      <br />
                    </>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
