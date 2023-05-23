import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "./components/Forms";
import Background from "./components/Background";
import "./scss/auth.scss";
import useLocalStorageState from "../../util/useLocalStorageState";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [validate, setValidate] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [, setJwt] = useLocalStorageState("", "jwt");
  const [, setCurrentUser] = useLocalStorageState(null, 'currentUser');


  const validateLogin = () => {
    let isValid = true;

    let validator = Form.validator({
      username: {
        value: username,
        isRequired: true,
        isEmail: false,
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

  const sendLoginRequest = () => {
    const reqBody = {
      username: username,
      password: password,
    };

    fetch("api/v1/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setJwt(res.headers.get("authorization"));
          return res.json();
        } else {
          return Promise.reject("Invalid login attempt");
        }
      })
      .then(user => {
        setCurrentUser(user);
        console.log('setting to', user);
        window.location.href = '/dashboard'
      })
      .catch((message) => {
        alert(message);
      });
  };

  const authenticate = (e) => {
    e.preventDefault();

    const validate = validateLogin();

    if (validate) {
      sendLoginRequest();
    }
  };

  const togglePassword = (e) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <div className="bootstrap-isolated">
      <div className="row g-0 auth-wrapper">
        <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
          <Background />
        </div>

        <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
          <div className="d-flex flex-column align-content-end">
            <div className="auth-body mx-auto">
              <p>Login to your account</p>
              <div className="auth-form-container text-start">
                <form
                  className="auth-form"
                  method="POST"
                  onSubmit={authenticate}
                  autoComplete={"off"}
                >
                  <div className="username mb-3">
                    <input
                      type="username"
                      className={`form-control ${
                        validate.validate && validate.validate.username
                          ? "is-invalid "
                          : ""
                      }`}
                      id="username"
                      name="username"
                      value={username}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
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

                  <div className="password mb-3">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          validate.validate && validate.validate.password
                            ? "is-invalid "
                            : ""
                        }`}
                        name="password"
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

                    <div className="extra mt-3 row justify-content-between">
                      <div className="col-6">
                        <div style={{ display: "flex" }}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={(e) =>
                              setRemember(e.currentTarget.checked)
                            }
                          />
                          <label
                            style={{ margin: "auto 10px" }}
                            className="form-check-label"
                            htmlFor="remember"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="forgot-password text-end">
                          <Link to="/forgot-password" className=".auth-link">
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn auth-btn btn-primary w-100 theme-btn mx-auto"
                    >
                      Log In
                    </button>
                  </div>
                </form>

                <hr />
                <div className="auth-option text-center pt-2">
                  No Account?{" "}
                  <Link className="text-link .auth-link" to="/register">
                    Sign up{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
