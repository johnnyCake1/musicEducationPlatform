import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import "./CoursePreviewCard.css";
import ProfilePicture from "../../Profile/components/profile_card/ProfilePicture";
import { FaBookmark } from "react-icons/fa";
import { getFile, httpReqAsync } from "../../../services/httpReqAsync";
import useLocalStorageState from "../../../util/useLocalStorageState";

const CoursePreviewCard = ({
  courseId,
  authorId,
  title = "",
  price = 0.0,
  takenCount = 0,
  formattedCreationDate = "date",
  tags,
  progress,
  onClick,
}) => {
  const [showAddToSavedIcon, setShowAddToSavedIcon] = useState(false);
  const [jwt] = useLocalStorageState("", "jwt");
  const [picSrc, setPicSrc] = useState("https://via.placeholder.com/500x500");
  const [author, setAuthor] = useState(null);
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    //get course's preview image
    getFile(`/api/v1/courses/${courseId}/preview-picture`, jwt)
      .then((pictureBlob) => {
        if (pictureBlob instanceof Blob) {
          setPicSrc(URL.createObjectURL(pictureBlob));
        }
      })
      .catch((err) => {
        console.log("bla");
      });
    //get author's info
    httpReqAsync(`/api/v1/users/${authorId}`, "GET", jwt).then((result) => {
      console.log("got the user:", result);
      setAuthor(result);
    });
    //get current user's info
    httpReqAsync(`/api/v1/users/${currentUser?.id}`, "GET", jwt).then(
      (result) => {
        setIsSaved(result.savedCoursesIds.includes(courseId));
      }
    );
  }, [jwt, courseId, authorId, isSaved, currentUser?.id]);

  const toggleSaveCourse = (e) => {
    e.preventDefault();
    // if already saved then remove from saved
    if (isSaved) {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses/${courseId}`,
        "DELETE",
        jwt
      ).then((result) => {
        console.log("course saved value updated to:", !isSaved);
        setIsSaved(!isSaved);
      });
      // if not saved then save
    } else {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses/${courseId}`,
        "POST",
        jwt
      ).then((result) => {
        console.log("course saved value updated to:", !isSaved);
        setIsSaved(!isSaved);
      });
    }
  };

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="card-container"
      onMouseEnter={() => setShowAddToSavedIcon(true)}
      onMouseLeave={() => setShowAddToSavedIcon(false)}
    >
      {picSrc ? (
        <img onClick={onClick} className="image" src={picSrc} alt={title} />
      ) : (
        <div className="image">image is loading</div>
      )}

      <div className="card-body">
        <ProfilePicture userId={author.id} size={40} />
        <div className="user-info">
          <h3 className="card-title" onClick={onClick}>
            {title}
          </h3>
          <span className="card-username">{`By ${author?.username}`}</span>
          <span className="card-info">{`${takenCount} taken • ${formattedCreationDate}`}</span>
          <span className={`card-price ${price === 0 ? "free" : ""}`}>
            {price === 0 ? "Free" : `$${price}`}
          </span>
          {tags && (
            <div className="tags-container">
              {tags.map((tag) => (
                <span key={tag} className="card-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <FaBookmark
        onClick={toggleSaveCourse}
        className={`add-to-saved-icon ${
          isSaved || showAddToSavedIcon ? "visible" : ""
        }`}
      />
      {progress && (
        <div
          className="preview-card-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      )}
    </div>
  );
};

CoursePreviewCard.propTypes = {
  courseId: PropTypes.number.isRequired,
  authorId: PropTypes.number.isRequired,
};

export default CoursePreviewCard;
