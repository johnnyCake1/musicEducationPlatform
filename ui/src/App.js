import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Authentication/Login";
import Forgot from "./components/Authentication/Forgot";
import Register from "./components/Authentication/Register";
import ProfilePage from "./components/Profile/ProfilePage";

import SearchResult from "./components/Search/SearchResult";
import CourseDescription from "./components/Course/CourseDescription";
import ChatPage from "./components/Chat/ChatPage";
import MyCourses from "./components/MyCourses/MyCourses";
import Courses from "./components/Courses/Courses";
import Storage from "./components/Saved/Storage";
// import CourseContentPage from "./components/Course/CourseContentPage";
import Logout from "./components/Authentication/Logout";
import Settings from "./components/Settings/Settings";
import CourseCreationPage from "./components/CourseCreation/CourseCreation";

import MyLearnings from "./components/MyLearnings/MyLearnings";
import withSidebarAndAuth from "./components/common/withSidebarAndAuth";
import ContentAndAuth from "./components/common/ContentAndAuth";
import Homepage from "./components/Homepage/Homepage";
import ChatComponent from "./components/Chat/ChatComponent";
import StripePayment from "./components/Payment/StripePayment";

function App() {
  return (
    <div className="App">
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
            path="/my-courses/drafts/:courseId"
            element={withSidebarAndAuth(CourseCreationPage)}
          />
          <Route
            path="/courses/content/:courseId/:moduleId/:topicId"
            element={withSidebarAndAuth(ContentAndAuth)}
          />
          <Route path="/courses" element={withSidebarAndAuth(Courses)} />
          <Route path="/pay" element={withSidebarAndAuth(StripePayment)} />
          <Route
            path="/courses/create"
            element={withSidebarAndAuth(CourseCreationPage)}
          />

          <Route
            path="/my-learnings"
            element={withSidebarAndAuth(MyLearnings)}
          />
          <Route path="/demoChat" element={withSidebarAndAuth(ChatComponent)} />
          <Route path="/chat" element={withSidebarAndAuth(ChatPage)} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
