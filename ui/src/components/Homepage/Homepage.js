import './Homepage.css';
import lessonPicture from "./assets/violin_lesson.jpeg"
import courseCreationPicture1 from "./assets/course-creation.png"
import courseCreationPicture2 from "./assets/course-overview.png"

import {
  Navbar,
  Header,
  Features,
  Testimonials,
  Faq,
  Footer,
} from './components';
import CardsGallery from './components/cardsgallery/CardsGallery';
import Features2 from './components/features2/Features2';

const Homepage = () => {
  return (
    <div className="homepage-styling">
      <div className="header-bg">
        <Navbar />
        <Header />
      </div>

      

      <Features
        heading={'Create Your Music Course'}
        descriptions={[
            `Unleash your musical expertise and share it with the world on Melodious! Whether you're a seasoned musician or a passionate hobbyist, our platform empowers you to craft engaging music courses with ease. Effortlessly upload various content types – from insightful text and high-resolution images to captivating videos and interactive quizzes. Reach a global audience, inspire budding musicians, and earn for your knowledge`,
        ]}
        fourIcons={[courseCreationPicture1, courseCreationPicture2, lessonPicture, lessonPicture]}
        data-aos="fade-up"
      />
        <Features
            heading={'Explore And Learn'}
            descriptions={[
                `Our platform offers a vast variety of courses, tailored for every skill level and interest. Whether you're taking your first musical steps or refining advanced techniques, find courses designed to enhance your journey. Engage with top-notch tutors, benefit from personalized recommendations, and immerse yourself in interactive learning experiences.`,
            ]}
            fourIcons={[lessonPicture, lessonPicture, lessonPicture, lessonPicture]}
            data-aos="fade-up"
        />
        <Features
            heading={'Connect & Collaborate'}
            descriptions={[
                `Join our community of music enthusiasts on Melodious. Connect with fellow learners, exchange ideas, and collaborate on exciting musical projects. Our platform isn't just about learning; it's about sharing experiences, forming connections, and building a network of music lovers.`,
            ]}
            fourIcons={[lessonPicture, lessonPicture, lessonPicture, lessonPicture]}
            data-aos="fade-up"
        />
      <Testimonials />
      <CardsGallery />
      <Features2 />
      <Faq />
      <Footer />
    </div>
  );
};

export default Homepage;
