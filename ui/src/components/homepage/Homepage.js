import "./Homepage.css";

import {
  Navbar,
  Header,
  Features,
  Testimonials,
  Faq,
  Footer,
} from "./components";
import CardsGallery from "./components/cardsgallery/CardsGallery";

const Homepage = () => {
  return (
    <div className="homepage-styling">
      <header className="header-bg">
        <Navbar />
        <Header />
      </header>
      <Features
        heading={"Find the perfect tutor"}
        description1={`Welcome to our platform, where we connect music learners with
                  experienced tutors from all over the world. We've created a
                  platform that offers personalized courses tailored to your
                  interests and skill level.`}
        description2={`With our interactive course content, you'll learn in a way
                  that's engaging and fun. You'll have access to video lessons,
                  images, and other interactive tasks that will help you improve
                  your skills in no time. Plus, you'll be able to chat with your
                  tutor and other learners to get support and feedback along the
                  way.`}
        data-aos="fade-up"
      />
      <Features
        heading={"Find the perfect tutor"}
        description1={`Welcome to our platform, where we connect music learners with
                  experienced tutors from all over the world. We've created a
                  platform that offers personalized courses tailored to your
                  interests and skill level.`}
        description2={`With our interactive course content, you'll learn in a way
                  that's engaging and fun. You'll have access to video lessons,
                  images, and other interactive tasks that will help you improve
                  your skills in no time. Plus, you'll be able to chat with your
                  tutor and other learners to get support and feedback along the
                  way.`}
        data-aos="fade-up"
      />
      <Features
        heading={"Find the perfect tutor"}
        description1={`Welcome to our platform, where we connect music learners with
                  experienced tutors from all over the world. We've created a
                  platform that offers personalized courses tailored to your
                  interests and skill level.`}
        description2={`With our interactive course content, you'll learn in a way
                  that's engaging and fun. You'll have access to video lessons,
                  images, and other interactive tasks that will help you improve
                  your skills in no time. Plus, you'll be able to chat with your
                  tutor and other learners to get support and feedback along the
                  way.`}
        data-aos="fade-up"
      />
      <Testimonials />
      <CardsGallery />
      <Faq />
      <Footer />
    </div>
  );
}

export default Homepage;
