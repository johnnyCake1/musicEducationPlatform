import React, { useEffect, useState } from "react";
import CoursePreviewCard from "../Course/components/CoursePreviewCard";
import TabbedPage from "../common/TabbedPage";
import { useNavigate } from "react-router-dom";
import { httpReqAsync } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";
import "./MyLearnings.css";

const MyCourses = () => {
  //TODO: implement finished courses filter
  const finishedCourses = [];
  const navigate = useNavigate();
  const [jwt] = useLocalStorageState("", "jwt");
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [takenCourses, setTakenCourses] = useState(null);
  const [savedCourses, setSavedCourses] = useState(null);
  useEffect(() => {
    //get taken courses
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/taken-courses`,
      "GET",
      jwt
    ).then((result) => {
      setTakenCourses(result);
    });
    //get saved courses
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/saved-courses`,
      "GET",
      jwt
    ).then((result) => {
      setSavedCourses(result);
    });
  }, [jwt, currentUser]);

  const archived = [];

  const tabs = [
    {
      name: "takenCourses",
      label: "Taken courses",
      content: takenCourses ? (
        takenCourses.length > 0 ? (
          <div className="my-cards-grid">
            {takenCourses.map((course) => (
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
                onClick={() => navigate(`/courses/${course.id}/description`)}
              />
            ))}
          </div>
        ) : (
          <div>{"Nothing in your taken courses yet :("}</div>
        )
      ) : (
        <div>Loading ...</div>
      ),
    },
    {
      name: "finishedCourses",
      label: "Finished courses",
      content:
        finishedCourses.length > 0 ? (
          <div className="my-cards-grid">
            {finishedCourses.map((course) => (
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
                onClick={() => navigate(`/courses/${course.id}/description`)}
              />
            ))}
          </div>
        ) : (
          <div>{"Nothing in your finished courses yet :("}</div>
        ),
    },
    {
      name: "saveCourses",
      label: "Saved courses",
      content: savedCourses ? (
        savedCourses.length > 0 ? (
          <div className="my-cards-grid">
            {savedCourses.map((course) => (
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
                onClick={() => navigate(`/courses/${course.id}/description`)}
              />
            ))}
          </div>
        ) : (
          <div>{"Nothing in your saved courses yet :("}</div>
        )
      ) : (
        <div>Loading ...</div>
      ),
    },
    {
      name: "archived",
      label: "Archived",
      content:
        archived.length > 0 ? (
          <div className="my-cards-grid">
            {archived.map((course) => (
              <CoursePreviewCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div>{"Nothing in your archives yet :("}</div>
        ),
    },
  ];

  return <TabbedPage tabs={tabs} />;
};

export default MyCourses;
