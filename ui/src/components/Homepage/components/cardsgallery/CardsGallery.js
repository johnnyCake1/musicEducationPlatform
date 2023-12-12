import React, { useEffect } from 'react';
// import './CardsGallery.css';
import lessonPicture from '../../assets/violin_lesson.jpeg';

import AOS from 'aos';
import 'aos/dist/aos.css';
import Explore from '../../../Explore/Explore';

const CardsGallery = () => {
  const cards = [
    {
      image: 'https://picsum.photos/300/200?random=1',
      title: 'Card 1',
      description: 'This is the first card',
    },
    {
      image: 'https://picsum.photos/300/200?random=2',
      title: 'Card 2',
      description: 'This is the second card',
    },
    {
      image: 'https://picsum.photos/300/200?random=3',
      title: 'Card 3',
      description: 'This is the third card',
    },
    {
      image: 'https://picsum.photos/300/200?random=4',
      title: 'Card 4',
      description: 'This is the fourth card',
    },
    {
      image: 'https://picsum.photos/300/200?random=5',
      title: 'Card 5',
      description: 'This is the fifth card',
    },
    {
      image: 'https://picsum.photos/300/200?random=6',
      title: 'Card 6',
      description: 'This is the sixth card',
    },
  ];
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id='courses'>
      <div
        data-aos="fade-left"
        className="container px-4 py-10 mx-auto lg:h-128 lg:space-x-8 lg:flex lg:items-center"
      >
        <div className="w-full text-center lg:text-left lg:w-1/2 lg:-mt-8 text-white">
          <h1 className="text-3xl leading-snug text-gray-800 dark:text-gray-200 md:text-4xl">
            Explore the world of music education on Melodious!
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Discover a wide range of courses, from free to premium, covering various music categories. Search for your favorite courses and instructors, leave reviews and ratings, and connect with fellow learners. Join Melodious today and start your musical journey!
          </p>
          <div className="mt-6 bg-transparent border rounded-lg dark:border-gray-700 lg:w-2/3 focus-within:border-primary focus-within:ring focus-within:ring-primary dark:focus-within:border-primary focus-within:ring-opacity-20">
            <form
              action="/explore-courses"
              className="flex flex-wrap justify-between md:flex-row"
            >
              <input
                type="search"
                name="search"
                placeholder="Search Courses"
                required="required"
                className="flex-1 h-10 px-4 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none lg:h-12 dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-full p-2 m-1 text-white transition-colors duration-300 transform rounded-lg lg:w-12 lg:h-12 lg:p-0 my-btn-light hover:bg-primary/70 focus:outline-none focus:bg-primary/70"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
        <div className="w-full mt-4 lg:mt-0 lg:w-1/2">
          <img
            src={lessonPicture}
            alt="web designer"
            className="w-full h-full max-w-md mx-auto"
          />
        </div>
      </div>
      <div id="cards" className="pt-10">
        <div className="container-fluid cards-gallery" data-aos="fade-up">
          <Explore />
        </div>
      </div>
    </section>
  );
};

export default CardsGallery;
