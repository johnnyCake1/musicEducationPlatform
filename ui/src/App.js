import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/common/PrivateRoute";
import AssignmentView from "./components/AssignmentView";
import Homepage from "./components/Homepage/Homepage";
import Login from "./components/Authentication/Login";
import Forgot from "./components/Authentication/Forgot";
import Register from "./components/Authentication/Register";
import ProfilePage from "./components/Profile/ProfilePage";
import Navigation from "./components/common/Navigation";
import SearchResult from "./components/Search/SearchResult";
import CourseDescription from "./components/Course/CourseDescription";
import ChatPage from "./components/Chat/ChatPage";
import MyCourses from "./components/MyCourses/MyCourses";
import Storage from "./components/Saved/Storage";
import CourseContentPage from "./components/Course/CourseContentPage";
import Logout from "./components/Authentication/Logout";
import Settings from "./components/Settings/Settings";
import CourseCreationPage from "./components/CourseCreation/CourseCreation";

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
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route
            path="/:userId/profile"
            element={withSidebarAndAuth(ProfilePage)}
          />
          <Route path="/settings" element={withSidebarAndAuth(Settings)} />
          <Route path="/dashboard" element={withSidebarAndAuth(Dashboard)} />
          <Route
            path="/search/:keyword"
            element={withSidebarAndAuth(SearchResult)}
          />
          <Route path="/my-courses" element={withSidebarAndAuth(MyCourses)} />
          <Route path="/storage" element={withSidebarAndAuth(Storage)} />
          <Route
            path="/courses/:courseId/description"
            element={withSidebarAndAuth(CourseDescription)}
          />
          <Route
            path="/courses/:courseId/content"
            element={withSidebarAndAuth(CourseContentPage)}
          />
          <Route
            path="/courses"
            element={withSidebarAndAuth(CourseDescription)}
          />
          <Route
            path="/courses/create"
            element={withSidebarAndAuth(CourseCreationPage)}
          />
          <Route
            path="/assignments/:id"
            element={withSidebarAndAuth(AssignmentView)}
          />
          <Route path="/chat" element={withSidebarAndAuth(ChatPage)} />
          <Route path="/ass" element={withSidebarAndAuth(AssignmentView)} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
