import React from "react";
import "./Button.css";

const Button = ({ text, btnClass, href, onClick }) => {
  return (
    <a href={href} className={`my-btn ${btnClass}`} onClick={onClick}>
      {text}
    </a>
  );
};

export default Button;
