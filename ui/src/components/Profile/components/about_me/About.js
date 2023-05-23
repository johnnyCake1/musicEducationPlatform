import "./About.css";

const About = ({ aboutMeText }) => {
  return (
    <div className="profile-about">
      <h2>About Me</h2>
      <p>{aboutMeText ?? ""}</p>
    </div>
  );
};

export default About;
