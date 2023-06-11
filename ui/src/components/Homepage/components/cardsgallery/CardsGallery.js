import React, { useEffect } from "react";
import "./CardsGallery.css";

import AOS from "aos";
import "aos/dist/aos.css";
import CardSlider from "./cardSlider/CardSlider";
import SearchBar from "./SearchBar";

const CardsGallery = () => {
  const cards = [
    {
      image: "https://picsum.photos/300/200?random=1",
      title: "Card 1",
      description: "This is the first card",
    },
    {
      image: "https://picsum.photos/300/200?random=2",
      title: "Card 2",
      description: "This is the second card",
    },
    {
      image: "https://picsum.photos/300/200?random=3",
      title: "Card 3",
      description: "This is the third card",
    },
    {
        image: "https://picsum.photos/300/200?random=4",
        title: "Card 4",
        description: "This is the fourth card",
      },
      {
        image: "https://picsum.photos/300/200?random=5",
        title: "Card 5",
        description: "This is the fifth card",
      },
      {
        image: "https://picsum.photos/300/200?random=6",
        title: "Card 6",
        description: "This is the sixth card",
      },
  ];
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="cards-gallery">
      <div className="container cards-gallery" data-aos="fade-up">
        <h2>Browse Courses by Instruments</h2>
        <CardSlider cards={cards}/>
        <SearchBar />
        <br /> 
        <h2>Meet Our Top Tutors</h2>
        <CardSlider cards={cards}/>
      </div>
      
    </section>
  );
};

export default CardsGallery;
