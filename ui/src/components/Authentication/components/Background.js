import Logo from "../../common/Logo";
import "../scss/auth.scss";

const Background = () => {
  return (
    <div className="auth-background-mask">
      <div className="auth-back-text-container">
        <div className="auth-back-text">Start Your Music Journey</div>
      </div>
      <div className="auth-back-logo-container">
        <div className="auth-back-logo">
          <Logo w="300px" h="110px" />
        </div>
      </div>
    </div>
  );
};

export default Background;
