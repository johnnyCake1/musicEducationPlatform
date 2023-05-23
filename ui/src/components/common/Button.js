import React from "react";
import "./Button.css";

const Button = ({ text, btnClass, href, onClick }) => {
  btnClass = btnClass ?? 'my-btn-light';
  return (
    <a href={href} className={`my-btn ${btnClass}`} onClick={onClick}>
      {text}
    </a>
  );
};

export default Button;
