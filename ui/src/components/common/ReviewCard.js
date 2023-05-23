import { useEffect, useState } from "react";
import ProfilePicture from "../Profile/components/profile_card/ProfilePicture";
import { httpReqAsync } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const [reviewerUsername, setReviewerUsername] = useState("");
  const [jwt] = useLocalStorageState("", "jwt");
  useEffect(() => {
    httpReqAsync(`/api/v1/users/${review.reviewer}/username`, 'GET', jwt).then(
      (username) => {
        setReviewerUsername(username);
      }
    );
  });
  return (
    <div className="review-card">
      <div className="review-profile-picture profile-picture-wrapper">
        <ProfilePicture userId={review.reviewer} size={50} borderColor="#fff" />
      </div>
      <div className="review-info">
        <h4 className="username">{reviewerUsername}</h4>
        <div className="rating">
          {[...Array(review.rating)].map((_, index) => (
            <span key={index} className="star">
              &#9733;
            </span>
          ))}
        </div>
        <p className="comment">{review.reviewMessage}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
