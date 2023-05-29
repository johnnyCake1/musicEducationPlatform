import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import CoursePreviewCard from "./CoursePreviewCard";
import "./Slider.css";
import CourseCard from './MyCourseCard';

const Slider = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("cards", cards)
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const visibleCards =
    cards.length <= 3
      ? cards
      : [
          cards[currentIndex],
          cards[(currentIndex + 1) % cards.length],
          cards[(currentIndex + 2) % cards.length],
        ];
  console.log('visibleCards', visibleCards)
  return (
    <div className="my-card-slider">
      {cards.length > 3 && (
        <BsArrowLeft className="my-card-arrow left" onClick={handlePrev} />
      )}
      <div className="my-cards-container">
        {visibleCards.map((card, index) => (
          <div key={index} className="my-card-container">
            <CourseCard course={card} />
          </div>
        ))}
      </div>
      {cards.length > 3 && (
        <BsArrowRight className="my-card-arrow right" onClick={handleNext} />
      )}
    </div>
  );
};

export default Slider;
