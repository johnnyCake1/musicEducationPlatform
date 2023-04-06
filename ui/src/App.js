import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AssignmentView from "./components/AssignmentView";

function App() {
  console.log("Hello from App!");

  return (
    <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route
        path="/assignments/:id"
        element={
          <PrivateRoute>
            <AssignmentView />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
