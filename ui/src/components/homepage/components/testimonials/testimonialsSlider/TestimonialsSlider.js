import React, { useState } from 'react';
import './TestimonialsSlider.css';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

function TestimonialsSlider({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length);
  };

  return (
    <div className="TestimonialsSlider">
      <div className="TestimonialsSlider-quote">
        <div className="TestimonialsSlider-profile">
          <img src={testimonials[currentIndex].profile} alt="Profile" />
        </div>
        <blockquote>{testimonials[currentIndex].quote}</blockquote>
        <cite>{testimonials[currentIndex].author}</cite>
        <div className="TestimonialsSlider-rating">
          {[...Array(testimonials[currentIndex].rating)].map((_, index) => (
            <span key={index}>★</span>
          ))}
        </div>
      </div>
      <div className="TestimonialsSlider-nav">
        <button className="TestimonialsSlider-button" onClick={handlePrevClick}>
          <BsArrowLeft />
        </button>
        <button className="TestimonialsSlider-button" onClick={handleNextClick}>
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
}

export default TestimonialsSlider;
