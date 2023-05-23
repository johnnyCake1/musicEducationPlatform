import React from "react";
import "./Curriculum.css";

const Curriculum = (props) => {
  const { topics } = props;
  return (
    <div className="curriculum__list-container">
      {topics.map((topic, index) => (
        <div key={index} className="curriculum__item-container">
          <div className="curriculum__item-heading">
            <span className="curriculum__item-number">{index + 1}.</span>
            <span className="curriculum__item-title">{topic.topicName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Curriculum;
