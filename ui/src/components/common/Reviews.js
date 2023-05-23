import React, { useState } from "react";
import "./Reviews.css";
import ReviewSubmission from "./ReviewSubmission";
import ReviewCard from "./ReviewCard";

const Reviews = ({ reviews, onSubmitReview, currentUserCanReview }) => {
  const showReviewForm = currentUserCanReview;
  console.log("can show", showReviewForm);

  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const numReviewsToDisplay = 3;

  const handleShowMoreReviews = () => {
    setShowMoreReviews(true);
  };

  return (
    <div className="reviews">
      {reviews?.length > 0 ? (
        <>
          <div className="reviews-section">
            {reviews
              .slice(0, showMoreReviews ? undefined : numReviewsToDisplay)
              .map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
          </div>
          {!showMoreReviews && reviews.length > numReviewsToDisplay && (
            <button
              className="reviews__show-more-button"
              onClick={handleShowMoreReviews}
            >
              Show more reviews
            </button>
          )}
        </>
      ) : (
        <div>No reviews yet</div>
      )}
      {showReviewForm && <ReviewSubmission onSubmit={onSubmitReview} />}
    </div>
  );
};

export default Reviews;
