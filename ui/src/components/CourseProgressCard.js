import React from "react";

const CourseProgressCard = ({ courseName, courseImage, progress, status }) => {
  return (
    <div className="course-card">
      <div className="course-image">
        <img src={courseImage} alt={courseName} />
      </div>
      <div className="course-details">
        <h3>{courseName}</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: progress }}>
            {progress}
          </div>
        </div>
        <p>Status: {status}</p>
      </div>
    </div>
  );
};

export default CourseProgressCard;
