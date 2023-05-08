import React, { useEffect } from "react";
import "./Features.css";
import lessonPicture from "../../assets/violin_lesson.jpeg"

import soundWaves from "../../assets/soundWaves.svg";

import AOS from "aos";
import "aos/dist/aos.css";
import PictureTile from "./PictureTile";

const Features = ({ heading, description1, description2, fourIcons }) => {
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
            {/* <img src={phoneFeatures} alt="phone" /> */}
            <PictureTile images={[lessonPicture, lessonPicture, lessonPicture, lessonPicture]} />
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
                <p className="u-text-small">
                  {description1}
                </p>
                <br />
                <p className="u-text-small">
                  {description2}
                </p>
                <p className="u-text-small">{"blablabla"}</p>
              </div>
            </div>
            {/**/}
            {/* {FeatureList.map((feature) => (
              <Feature
                key={feature.id}
                icon={feature.icon}
                heading={feature.heading}
                text={feature.text}
              />
            ))} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
