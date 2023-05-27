import React, { useEffect, useState } from "react";
import CoursePreviewCard from "../Course/components/CoursePreviewCard";
import TabbedPage from "../common/TabbedPage";
import { Link, useNavigate } from "react-router-dom";
import { httpReqAsync } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";
import "./MyCourses.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const [jwt] = useLocalStorageState("", "jwt");
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [publishedCourses, setPublishedCourses] = useState(null);
  const [draftCourses, setDraftCourses] = useState(null);
  useEffect(() => {
    //get published courses
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/published-courses`,
      "GET",
      jwt
    ).then((result) => {
      setPublishedCourses(result);
    });
    //get saved courses
    httpReqAsync(
      `/api/v1/courses/draft-courses?authorId=${currentUser.id}`,
      "GET",
      jwt
    ).then((result) => {
      console.log("drafts:", result);
      setDraftCourses(result);
    });
  }, [jwt, currentUser]);

  const handleDraftCreation = () => {
    httpReqAsync(
      `/api/v1/courses/draft-courses/create-empty?authorId=${currentUser.id}`,
      "POST",
      jwt
    ).then((emptyCourseData) => {
      console.log("here is result:!", emptyCourseData);
      navigate(`/my-courses/drafts/${emptyCourseData.id}`);
    });
  };
  const tabs = [
    {
      name: "publishedCourses",
      label: "Published courses",
      content: (
        <>
          {publishedCourses ? (
            publishedCourses.length > 0 ? (
              <div className="my-cards-grid">
                {publishedCourses.map((course) => (
                  <CoursePreviewCard
                    key={course.id}
                    courseId={course.id}
                    authorId={course.author}
                    title={course.courseName}
                    takenCount={course?.enrolledStudents?.length}
                    formattedCreationDate={new Date(
                      course.creationDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    price={course.price}
                    tags={course.tags}
                    onClick={() =>
                      navigate(`/courses/${course.id}/description`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div>{"Nothing in your published courses yet :("}</div>
            )
          ) : (
            <div>Loading ...</div>
          )}
          <span onClick={handleDraftCreation} className="create-course-link">
            Click here to create a new course
          </span>
          {/* <Link to="/courses/create" className="create-course-link">
            Click here to create a new course
          </Link> */}
        </>
      ),
    },
    {
      name: "draftCourses",
      label: "Draft courses",
      content: (
        <>
          {draftCourses ? (
            draftCourses.length > 0 ? (
              <div className="my-cards-grid">
                {draftCourses.map((course) => (
                  <CoursePreviewCard
                    key={course.id}
                    courseId={course.id}
                    authorId={course.authorId}
                    title={course.courseName}
                    takenCount={course?.enrolledStudents?.length}
                    formattedCreationDate={new Date(
                      course.creationDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    price={course.price}
                    tags={course.tags}
                    onClick={() => navigate(`/my-courses/drafts/${course.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div>{"Nothing in your published courses yet :("}</div>
            )
          ) : (
            <div>Loading ...</div>
          )}
          <span onClick={handleDraftCreation} className="create-course-link">
            Click here to create a new course
          </span>
          {/* <Link to="/courses/create" className="create-course-link">
            Click here to create a new course
          </Link> */}
        </>
      ),
    },
  ];

  return <TabbedPage tabs={tabs} />;
};

export default MyCourses;
