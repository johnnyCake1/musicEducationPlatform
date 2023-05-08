import CardSlider from "../../../Homepage/components/cardsgallery/cardSlider/CardSlider";
import "./Courses.css";

const Courses = ({ cards }) => {
  return (
    <div className="profile-courses-section">
      <h2>Courses</h2>
      <hr />
      <CardSlider cards={cards} />
    </div>
  );
};

export default Courses;
