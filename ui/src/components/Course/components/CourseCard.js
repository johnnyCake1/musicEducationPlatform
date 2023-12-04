import React, { useState } from 'react';
import { httpReqAsync } from '../../../services/httpReqAsync';
import useLocalStorageState from '../../../util/useLocalStorageState';
import { Link } from 'react-router-dom';
import '../../common/Custom.css';
const CourseCard = ({ course }) => {
  const [showAddToSavedIcon, setShowAddToSavedIcon] = useState(false);
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [isSaved, setIsSaved] = useState(
    course?.savedInStudentsIds
      ? course?.savedInStudentsIds?.includes(currentUser?.id)
      : false
  );

  const toggleSaveCourse = (e) => {
    e.preventDefault();
    // if already saved then remove from saved
    if (isSaved) {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses/${course.id}`,
        'DELETE',
        jwt
      ).then((result) => {
        console.log('course saved value updated to:', !isSaved);
        setIsSaved(!isSaved);
      });
      // if not saved then save
    } else {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses/${course.id}`,
        'POST',
        jwt
      ).then((result) => {
        console.log('course saved value updated to:', !isSaved);
        setIsSaved(!isSaved);
      });
    }
  };

  return (
    <Link
      onMouseEnter={() => setShowAddToSavedIcon(true)}
      onMouseLeave={() => setShowAddToSavedIcon(false)}
      to={`/courses/${course.id}/description`}
      className="uk-link-reset"
    >
      <div className="course_card card uk-transition-toggle">
        <div className="card-media h-40">
          <ion-icon
            onClick={toggleSaveCourse}
            class={`add-to-saved-icon ${
              isSaved || showAddToSavedIcon ? 'visible' : ''
            }`}
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
          />
          <img
            src={
              course.img_url
                ? course.img_url
                : 'https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-21.jpg'
            }
            alt=""
            className=""
          />
        </div>
        <div className="card-body p-4">
          <div className="font-semibold line-clamp-2">
            {course.courseName === '' ? 'NO NAME' : course.courseName}
          </div>
          <div className="flex space-x-2 items-center text-sm pt-3 short-desc">
            <div> {course.courseShortDescription} </div>
          </div>
          <div className="pt-1 flex items-center justify-between">
            <div className="text-sm font-semibold">
              Author: {course.author?.username}
            </div>
            <div className="text-lg font-semibold">
              {course.price ? '$' + course.price : 'FREE'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
