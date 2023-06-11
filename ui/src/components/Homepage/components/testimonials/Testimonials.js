import React, { useEffect } from "react";
import "./Testimonials.css";
import AOS from "aos";
import "aos/dist/aos.css";
import TestimonialsSlider from "./testimonialsSlider/TestimonialsSlider";
import violin from "../../assets/violin_lesson.jpeg";

const Testimonials = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="testimonials">
      <div className="container testimonials" data-aos="fade-up">
        <h2>Testimonials</h2>
        <p className="u-text-small">See what our users say about us</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "600px" }}>
            <TestimonialsSlider
              testimonials={[
                {
                  quote:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel tellus vitae diam aliquam dapibus.",
                  author: "John Doe",
                  rating: 4,
                  profile: violin,
                },
                {
                  quote:
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                  author: "Jane Doe",
                  rating: 5,
                  profile: violin,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
