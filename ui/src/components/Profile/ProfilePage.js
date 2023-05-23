import React, { useEffect, useState } from "react";
import "./ProfilePage.css";

import ProfileCard from "./components/profile_card/ProfileCard";
import About from "./components/about_me/About";
import Reviews from "../common/Reviews";
import { httpReqAsync } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../Course/components/Slider";

const ProfilePage = () => {
  const { userId } = useParams();
  const [jwt] = useLocalStorageState("", "jwt");
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [takenCourses, setTakenCourses] = useState([]);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    //get the basic user info
    httpReqAsync(`/api/v1/users/${userId}`, "GET", jwt).then((result) => {
      setUser(result);
    });
  }, [toggleRefresh, jwt, userId]);
  useEffect(() => {
    //get the reviews info
    httpReqAsync(`/api/v1/users/${userId}/reviews`, "GET", jwt).then(
      (result) => {
        setReviews(result);
      }
    );
    //get the taken courses
    httpReqAsync(`/api/v1/users/${userId}/taken-courses`, "GET", jwt).then(
      (result) => {
        setTakenCourses(
          result.map((c) => {
            return {
              courseId: c.id,
              authorId: c.author,
              title: c.courseName,
              price: c.price,
              takenCount: c?.enrolledStudents?.length,
              formattedCreationDate: new Date(
                c.creationDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              tags: c.tags,
              onClick: () => navigate(`/courses/${c.id}/description`),
              // progress: 50,
            };
          })
        );
      }
    );
    //get the published courses
    httpReqAsync(`/api/v1/users/${userId}/published-courses`, "GET", jwt).then(
      (result) => {
        setPublishedCourses(
          result.map((c) => {
            return {
              courseId: c.id,
              authorId: c.author,
              title: c.courseName,
              price: c.price,
              takenCount: c?.enrolledStudents?.length,
              formattedCreationDate: new Date(
                c.creationDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              tags: c.tags,
              onClick: () => navigate(`/courses/${c.id}/description`),
              // progress: 50,
            };
          })
        );
      }
    );
  }, [jwt, userId, navigate]);

  return (
    <div className="profile-wrapper">
      {user && (
        <ProfileCard
          userId={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          username={user.username}
          tags={user.tags}
          followersIds={user.followersIds}
          followingsIds={user.followingsIds}
          numberOfTakenCourses={user?.takenCoursesIds?.length}
          numberOfPublishedCourses={user?.publishedCoursesIds?.length}
          parentComponentRefreshToggle={toggleRefresh}
          setParentComponentRefreshToggle={setToggleRefresh}
        />
      )}
      <About aboutMeText={user?.aboutMe} />
      <div className="profile-content">
        <h2>Taken courses</h2>
        <hr />
        <Slider cards={takenCourses} />
        <h2>Published courses</h2>
        <hr />
        <Slider cards={publishedCourses} />
        <h2>Reviews</h2>
        <hr />
        {reviews && (
          <Reviews
            reviews={reviews}
            currentUserCanReview={String(currentUser.id) !== String(userId)}
            onSubmitReview={(reviewToSubmit) =>
              httpReqAsync(
                `/api/v1/users/${userId}/reviews`,
                "POST",
                jwt,
                reviewToSubmit
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
