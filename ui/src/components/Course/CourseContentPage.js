import React, { useEffect, useState } from "react";
// import "./CourseContentPage.css"; // Import the CSS file for styling
import { useParams } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";
import { getFile, httpReqAsync } from "../../services/httpReqAsync";
import VideoPlayer from "../common/VideoPlayer";
import DisplayableContent from "./components/DisplayableContent";
import TabbedPage from "../common/TabbedPage";
import { FaBook, FaCheck } from "react-icons/fa";
import Question from "../Homepage/components/faq/Question";
import Curriculum from "./components/Curriculum";
import Reviews from "../common/Reviews";

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [course, setCourse] = useState(null);
  const [courseVideoSrc, setCourseVideoSrc] = useState("");
  const [courseReviews, setCourseReviews] = useState(null);
  useEffect(() => {
    //get the course info
    httpReqAsync(`/api/v1/courses/${courseId}`, "GET", jwt).then((result) => {
      console.log("I got the course:", result);
      setCourse(result);
    });
    //get the reviews info
    httpReqAsync(`/api/v1/courses/${courseId}/reviews`, "GET", jwt).then(
      (result) => {
        setCourseReviews(result);
      }
    );
  }, [jwt, courseId]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!course) {
    return <></>;
  }

  const tabs = [
    {
      name: "overview",
      label: "Overview",
      content: (
        <>
          <div className="course-description">
            <h2>Description</h2>
            <p>{course.courseLongDescription}</p>
          </div>
          <div className="course-what-you-will-learn">
            <h2>What you'll learn</h2>
            <ul className="what-youll-learn__list">
              {course?.whatYouWillLearn?.map((item, index) => (
                <li key={index} className="what-youll-learn__item">
                  <FaCheck className="what-youll-learn__tick" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="course-requirements">
            <h2>Requirements</h2>
            <ul className="what-youll-learn__list">
              {course?.requirements?.map((item, index) => (
                <li key={index} className="what-youll-learn__item">
                  <FaBook className="what-youll-learn__tick" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="course-curriculum">
            <h2>Course Curriculum</h2>
            {course?.curriculum?.map((module, index) => (
              <Question key={index} title={module.moduleName}>
                <Curriculum topics={module.courseTopics} />
              </Question>
            ))}
          </div>
        </>
      ),
    },
    {
      name: "notes",
      label: "Notes",
      content: <div>Notes content</div>,
    },
    {
      name: "reviews",
      label: "Reviews",
      content: (
        <>
          <div className="course-reviews">
            <h2>Reviews</h2>
            <Reviews
              reviews={courseReviews}
              currentUserCanReview={course.enrolledStudents.includes(
                currentUser.id
              )}
              onSubmitReview={(reviewToSubmit) =>
                httpReqAsync(
                  `/api/v1/courses/${courseId}/reviews`,
                  "POST",
                  jwt,
                  reviewToSubmit
                )
              }
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="course-content-page">
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        {/* Sidebar Content */}
        {/* ... */}
        <button className="close-sidebar-button" onClick={toggleSidebar}>
          Close Sidebar
        </button>
      </div>

      <div
        className={`content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="displayable-media-window">
          {/* Displayable Media Window Content */}
          {/* ... */}
          
          <DisplayableContent>
            <VideoPlayer videoSrc={course.file_url} />
          </DisplayableContent>
        </div>

        <div className="body">
          <TabbedPage tabs={tabs} />
        </div>
      </div>

      {!isSidebarOpen && (
        <div className="open-sidebar-button" onClick={toggleSidebar}>
          <span className="arrow">&#8594;</span>
        </div>
      )}
    </div>
  );
};

export default CourseContentPage;
