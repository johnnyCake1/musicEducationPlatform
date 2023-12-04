import { useEffect, useState } from 'react';
import ProfilePicture from '../Profile/components/profile_card/ProfilePicture';
import { httpReqAsync } from '../../services/httpReqAsync';
import useLocalStorageState from '../../util/useLocalStorageState';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const [reviewer, setReviewer] = useState(null);
  const [jwt] = useLocalStorageState('', 'jwt');
  useEffect(() => {
    if (jwt && review.reviewer) {
      httpReqAsync(`/api/v1/users/${review.reviewer.id}`, 'GET', jwt).then(
        (user) => {
          setReviewer(user);
        }
      );
    }
  }, [jwt, review.reviewer]);
  return (
    <div className="review-card">
      <div className="review-profile-picture profile-picture-wrapper">
        <ProfilePicture
          imageSrc={reviewer?.img_url}
          size={50}
          borderColor="#fff"
        />
      </div>
      <div className="review-info">
        <h4 className="username">{reviewer?.username}</h4>
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
