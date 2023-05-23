import React, { useState } from "react";
import "./DisplayableContent.css"; // Import the CSS file for styling

const DisplayableContent = ({ isVanishing, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  isVanishing = true;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`displayable-content ${
        isVanishing && !isHovered ? "hide-buttons" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`previous-section-button ${
          isVanishing && !isHovered ? "hide-buttons" : ""
        }`}
      >
        &#8592;
      </div>

      {children}

      <div
        className={`next-section-button ${
          isVanishing && !isHovered ? "hide-buttons" : ""
        }`}
      >
        &#8594;
      </div>
    </div>
  );
};

export default DisplayableContent;
