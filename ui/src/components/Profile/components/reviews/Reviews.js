import ProfilePicture from "../profile_card/ProfilePicture";
import "./Reviews.css";

const Reviews = ({ reviews }) => {
  return (
    <div className="profile-reviews-section">
      <h2>Reviews</h2>
      <hr />
      {reviews.map((review, index) => (
        <div key={index} className="review-card">
          <div className="review-profile-picture profile-picture-wrapper">
            <ProfilePicture src={review.profilePic} size={50} borderColor="#fff" />
          </div>
          {/* <img
            src={review.profilePic}
            alt={`${review.username}'s profile`}
            className="profile-pic"
          />
          <ProfilePicture size={"3rem"} src={review.profilePic} /> */}
          <div className="review-info">
            <h4 className="username">{review.username}</h4>
            <div className="rating">
              {[...Array(review.rating)].map((_, index) => (
                <span key={index} className="star">
                  &#9733;
                </span>
              ))}
            </div>
            <p className="comment">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
