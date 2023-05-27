import React, { useEffect, useState } from "react";
import "./CourseSummaryCard.css";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import useLocalStorageState from "../../../util/useLocalStorageState";
import { httpReqAsync } from "../../../services/httpReqAsync";
import { useNavigate } from "react-router-dom";

const CourseSummaryCard = ({
  courseId,
  name,
  description,
  reviews,
  enrolledStudentsIds,
  authorId,
  lastUpdated,
  price,
}) => {
  const [jwt] = useLocalStorageState("", "jwt");
  const [author, setAuthor] = useState(null);
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const navigate = useNavigate();
  useEffect(() => {
    //get the author's info
    httpReqAsync(`/api/v1/users/${authorId}`, "GET", jwt).then((result) => {
      setAuthor(result);
    });
  }, [jwt, authorId, enrolledStudentsIds, currentUser]);

  const calculateRating = () => {
    let ratingsSum = 0;
    for (const review of reviews) {
      ratingsSum += review.rating;
    }
    return ratingsSum / reviews.length;
  };

  const rating = reviews && reviews.length > 0 ? calculateRating() : 0.0;

  // Calculate the star rating
  const stars = [];
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} />);
  }
  if (rating % 1 !== 0) {
    stars.push(<FaStarHalfAlt key={stars.length} />);
  }
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={stars.length} />);
  }

  const enrollCurrentUserToCourse = () => {
    console.log("enrolling");
    httpReqAsync(
      `/api/v1/courses/${courseId}/enroll?userId=${currentUser.id}`,
      "POST",
      jwt
    ).then((result) => {});
  };

  const dropCurrentUserFromCourse = () => {
    console.log("dropping");
    httpReqAsync(
      `/api/v1/courses/${courseId}/drop?userId=${currentUser.id}`,
      "POST",
      jwt
    ).then((result) => {});
  };

  const handleConvertToDraft = () => {
    httpReqAsync(
      `/api/v1/courses/${courseId}/convert-to-draft`,
      "POST",
      jwt
    ).then((result) => {
      navigate(`/my-courses/drafts/${courseId}`);
    });
  };

  // Determine the button text and action based on the price
  let buttonText = "";
  let buttonAction = null;
  if (enrolledStudentsIds.includes(currentUser.id)) {
    buttonText = "Enrolled (click to drop)";
    buttonAction = () => dropCurrentUserFromCourse();
  } else {
    buttonText = price === 0 ? "Enroll for free" : `$${price} - Buy`;
    buttonAction =
      price === 0
        ? () => enrollCurrentUserToCourse()
        : () => alert("Buying feature not available yet(");
  }

  return (
    <div className="course-summary-card">
      <div className="course-summary-card__header">
        <h2 className="course-summary-card__name">{name}</h2>
        <div className="course-summary-card__rating">
          {stars} ({reviews?.length})
        </div>
      </div>
      <p className="course-summary-card__description">{description}</p>
      <div className="course-summary-card__info">
        <p className="course-summary-card__info-item">
          {enrolledStudentsIds?.length} students
        </p>
        <p className="course-summary-card__info-item">
          Created by {author?.username}
        </p>
        <p className="course-summary-card__info-item">
          Last updated:
          {new Date(lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <button className="course-summary-card__button" onClick={buttonAction}>
        {buttonText}
      </button>
      {true && (
        <button
          className="course-summary-card__button"
          onClick={handleConvertToDraft}
        >
          Convert to draft to edit
        </button>
      )}
    </div>
  );
};

export default CourseSummaryCard;
