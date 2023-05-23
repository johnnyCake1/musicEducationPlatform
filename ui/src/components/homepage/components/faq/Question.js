import React, { useState } from "react";
import "./Question.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Question = ({ title, children }) => {
  const [showChildren, setShowChildren] = useState(false);

  const handleClick = () => {
    setShowChildren(!showChildren);
  };

  return (
    <div className="container question">
      <div className="question-title">
        <h4>{title}</h4>
        <button className="question-icons" onClick={handleClick}>
          {showChildren ? (
            <AiOutlineMinus color="red" />
          ) : (
            <AiOutlinePlus color="#1f93ff" />
          )}
        </button>
      </div>
      <div className="question-answer">
        {showChildren && <>{children}</>}
      </div>
    </div>
  );
};

export default Question;
