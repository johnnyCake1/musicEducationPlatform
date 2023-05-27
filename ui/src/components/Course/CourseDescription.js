import React, { useEffect, useState } from "react";
import Question from "../Homepage/components/faq/Question";
import "./CourseDescription.css";
import VideoPlayer from "../common/VideoPlayer";
import CourseSummaryCard from "./components/CourseSummaryCard";
import { FaBook, FaCheck } from "react-icons/fa";
import Curriculum from "./components/Curriculum";
import Reviews from "../common/Reviews";
import { useParams } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";
import { getFile, httpReqAsync } from "../../services/httpReqAsync";

const CourseDescription = () => {
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
    //get the course's video
    getFile(`/api/v1/courses/${courseId}/course-video`, jwt).then(
      (videoBlob) => {
        setCourseVideoSrc(URL.createObjectURL(videoBlob));
      }
    );
    //get the reviews info
    httpReqAsync(`/api/v1/courses/${courseId}/reviews`, "GET", jwt).then(
      (result) => {
        setCourseReviews(result);
      }
    );
  }, [jwt, courseId]);

  if (!course || !course.published) {
    return <div>Course not found</div>;
  }

  return course ? (
    <div className="course-description-container">
      <div className="about-course-content">
        <div className="course-header">
          <div className="course-header-left">
            {courseVideoSrc && <VideoPlayer videoSrc={courseVideoSrc} />}
          </div>
          <div className="course-header-right">
            <CourseSummaryCard
              courseId={course.id}
              authorId={course.authorId}
              name={course.courseName}
              description={course.courseShortDescription}
              reviews={course.reviews}
              enrolledStudentsIds={course.enrolledStudentsIds}
              lastUpdated={course.lastUpdatedDate}
              price={course.price}
            />
          </div>
        </div>
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
        <div className="course-reviews">
          <h2>Reviews</h2>
          <Reviews
            reviews={courseReviews}
            currentUserCanReview={course.enrolledStudentsIds.includes(
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
      </div>
    </div>
  ) : (
    <div>Loading .... </div>
  );
};

export default CourseDescription;
