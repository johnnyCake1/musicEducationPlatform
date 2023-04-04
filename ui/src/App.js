import "./App.css";

function App() {
  console.log("Hello from App!");

  const reqBody = {
    email: "my_dummy_mail_1",
    password: "my_dummy_password_1",
  };

  fetch("api/v1/auth/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(reqBody),
  })
    .then(res => Promise.all([res.json(), res.headers]))
    .then(([strBody, headers]) => {
      console.log(strBody);
      console.log(headers.get("authorization"));
    });

  return <div className="App">Hello World!</div>;
}

export default App;
