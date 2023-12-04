import React, { useState } from 'react';
import './ReviewSubmission.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import useLocalStorageState from '../../util/useLocalStorageState';

const ReviewSubmission = ({ onSubmit }) => {
  const [ratingStars, setRatingStars] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState('');
  const [currentUser] = useLocalStorageState(null, 'currentUser');

  const handleSubmit = (event) => {
    event.preventDefault();
    const reviewer = {
      id: currentUser.id,
    };
    onSubmit({ rating, reviewMessage, reviewer });
    setRatingStars(0);
    setReviewMessage('');
  };

  return (
    <form className="review-submission" onSubmit={handleSubmit}>
      <h3 className="review-submission__heading">Submit a review</h3>
      <div className="review-submission__rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`review-submission__star ${
              ratingStars >= i ? 'review-submission__star--filled' : ''
            }`}
            onMouseEnter={() => setRatingStars(i)}
            onMouseLeave={() => setRatingStars(rating)}
            onClick={() => (rating === i ? setRating(0) : setRating(i))}
          >
            {ratingStars >= i ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
      {rating > 0 && (
        <>
          <div className="review-submission__comment">
            <textarea
              placeholder="Write a review..."
              value={reviewMessage}
              rows="3"
              onChange={(e) => setReviewMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="review-submission__submit-button">
            Submit
          </button>
        </>
      )}
    </form>
  );
};

export default ReviewSubmission;
