import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/common/PrivateRoute";
import AssignmentView from "./components/AssignmentView";
import ChatPage from "./components/chat/Home";
import Homepage from "./components/Homepage/Homepage";
import Login from "./components/Authentication/Login";
import Forgot from "./components/Authentication/Forgot";
import Register from "./components/Authentication/Register";
import Home from "./components/Profile/ProfilePage";
import Navigation from "./components/common/Navigation";

function App() {
  console.log("Hello from App!");

  function withSidebarAndAuth(PageComponent) {
    return (
      <PrivateRoute>
        <div className="flex">
          <Navigation />
          <PageComponent />
        </div>
      </PrivateRoute>
    );
  }

  return (
    <div className="App flex">
      <div className="app-content">
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/profile" element={withSidebarAndAuth(Home)} />
          
          
          
          <Route path="/dashboard" element={withSidebarAndAuth(Dashboard)} />
          
          
          <Route
            path="/assignments/:id"
            element={withSidebarAndAuth(AssignmentView)}
          />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
