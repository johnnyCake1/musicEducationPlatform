import React, { useState, useEffect } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import "./CardSlider.css";
import ProgressBar from "../../../../common/ProgressBar";

const CardSlider = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderCards, setSliderCards] = useState(cards.slice(0, 3));

  const handleNextClick = () => {
    const newIndex = (currentIndex + 1) % cards.length;
    const newSliderCards = [
      cards[newIndex],
      cards[(newIndex + 1) % cards.length],
      cards[(newIndex + 2) % cards.length],
    ];
    setCurrentIndex(newIndex);
    setSliderCards(newSliderCards);
  };

  const handlePrevClick = () => {
    const newIndex = (currentIndex - 1 + cards.length) % cards.length;
    const newSliderCards = [
      cards[(newIndex + cards.length - 2) % cards.length],
      cards[(newIndex + cards.length - 1) % cards.length],
      cards[newIndex],
    ];
    setCurrentIndex(newIndex);
    setSliderCards(newSliderCards);
  };

  useEffect(() => {
    setSliderCards(cards.slice(0, 3));
  }, [cards]);

  return (
    <div className="CardSlider-container">
      <div className="CardSlider-cards">
        {sliderCards.map((card, index) => (
          <div className="CardSlider-card" key={index}>
            <div style={{ position: "relative" }}>
              <img src={card.image} alt={"card"} style={{ width: "100%" }} />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                {card.imageLabel ? (
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      padding: "10px",
                    }}
                  >
                    {card.imageLabel}
                  </div>
                ) : (
                  <></>
                )}
                {card.progress ? <ProgressBar percentage={card.progress} /> : <></>}
              </div>
            </div>
            <div className="CardSlider-card-body">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="CardSlider-nav">
        <button className="CardSlider-button" onClick={handlePrevClick}>
          <BsArrowLeft />
        </button>
        <button className="CardSlider-button" onClick={handleNextClick}>
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CardSlider;
