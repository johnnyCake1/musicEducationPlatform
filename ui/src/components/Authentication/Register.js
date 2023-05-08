import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "./components/Forms";
import Background from "./components/Background";
import "./scss/auth.scss";
import useLocalStorageState from "../../util/useLocalStorageState";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validate, setValidate] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [, setJwt] = useLocalStorageState("", "jwt");

  const validateRegister = () => {
    let isValid = true;

    let validator = Form.validator({
      username: {
        value: username,
        isRequired: true,
      },
      email: {
        value: email,
        isRequired: false,
        isEmail: true,
      },
      password: {
        value: password,
        isRequired: true,
        minLength: 6,
      },
    });

    if (validator !== null) {
      setValidate({
        validate: validator.errors,
      });

      isValid = false;
    }
    return isValid;
  };

  const register = (e) => {
    e.preventDefault();

    const validate = validateRegister();

    if (validate) {
      sendRegisterRequest();
    }
  };

  const sendRegisterRequest = () => {
    const reqBody = {
      username: username,
      password: password,
    };

    fetch("api/v1/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setJwt(res.headers.get("authorization"));
          window.location.href = "dashboard";
        } else {
          return Promise.reject("Invalid register attempt: ");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const togglePassword = (e) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <span className="bootstrap-isolated">
      <div className="row g-0 auth-wrapper">
        <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
          <Background />
        </div>

        <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
          <div className="d-flex flex-column align-content-end">
            <div className="auth-body mx-auto">
              <p>Create your Account</p>
              <div className="auth-form-container text-start">
                <form
                  className="auth-form"
                  method="POST"
                  onSubmit={register}
                  autoComplete={"off"}
                >
                  <div className="username mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        validate.validate && validate.validate.username
                          ? "is-invalid "
                          : ""
                      }`}
                      id="username"
                      username="username"
                      value={username}
                      placeholder="Username"
                      onChange={(e) => setName(e.target.value)}
                    />

                    <div
                      className={`invalid-feedback text-start ${
                        validate.validate && validate.validate.username
                          ? "d-block"
                          : "d-none"
                      }`}
                    >
                      {validate.validate && validate.validate.username
                        ? validate.validate.username[0]
                        : ""}
                    </div>
                  </div>

                  <div className="email mb-3">
                    <input
                      type="email"
                      className={`form-control ${
                        validate.validate && validate.validate.email
                          ? "is-invalid "
                          : ""
                      }`}
                      id="email"
                      username="email"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <div
                      className={`invalid-feedback text-start ${
                        validate.validate && validate.validate.email
                          ? "d-block"
                          : "d-none"
                      }`}
                    >
                      {validate.validate && validate.validate.email
                        ? validate.validate.email[0]
                        : ""}
                    </div>
                  </div>

                  <div className="password mb-3">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          validate.validate && validate.validate.password
                            ? "is-invalid "
                            : ""
                        }`}
                        username="password"
                        id="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn auth-btn btn-outline-primary btn-sm"
                        onClick={(e) => togglePassword(e)}
                      >
                        <i
                          className={
                            showPassword ? "far fa-eye" : "far fa-eye-slash"
                          }
                        ></i>{" "}
                      </button>

                      <div
                        className={`invalid-feedback text-start ${
                          validate.validate && validate.validate.password
                            ? "d-block"
                            : "d-none"
                        }`}
                      >
                        {validate.validate && validate.validate.password
                          ? validate.validate.password[0]
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 theme-btn mx-auto auth-btn"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>

                <hr />
                <div className="auth-option text-center pt-2">
                  Have an account?{" "}
                  <Link className="text-link .auth-link" to="/login">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
};

export default Register;
