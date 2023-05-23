import CardSlider from "../../../Homepage/components/cardsgallery/cardSlider/CardSlider";
import "./Courses.css";

const Courses = ({ cards }) => {
  return (
    <div className="profile-courses-section">
      <CardSlider cards={cards} />
    </div>
  );
};

export default Courses;
