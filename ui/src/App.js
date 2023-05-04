import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import PrivateRoute from "./components/PrivateRoute";
import AssignmentView from "./components/AssignmentView";
import Sidebar from "./screens/sidebar";
import CoursePage from "./components/CoursePage";
import DiscoverPage from "./components/DiscoverPage";
import CategoriesPage from "./screens/categories";
import MyCoursesPage from "./screens/mycourses";
import AccountPage from "./components/AccountPage";
import LoginPage from "./components/authorisation/LoginPage";
import RegisterPage from "./components/authorisation/RegisterPage";
import RestorePasswordPage from "./components/authorisation/RestorePasswordPage";
import NewPasswordPage from "./components/authorisation/NewPasswordPage";
import ChatPage from "./components/chat/Home";
import "./css/uifont.css";
import "./css/props.css";
import "./css/App.css";
import ProfilePage from "./components/ProfilePage";


function App() {
  console.log("Hello from App!");

  function withSidebarAndAuth(PageComponent) {
    return (
      <PrivateRoute>
        <div className="flex">
          <Sidebar />
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
          <Route path="/profile" element={withSidebarAndAuth(ProfilePage)} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restore_password" element={<RestorePasswordPage />} />
          <Route path="/new_password" element={<NewPasswordPage />} />
          <Route path="/dashboard" element={withSidebarAndAuth(Dashboard)} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route
            path="/assignments/:id"
            element={withSidebarAndAuth(AssignmentView)}
          />
          <Route path="/course/:courseid" element={<CoursePage />} />
          <Route path="/cates" element={<CategoriesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default App;
