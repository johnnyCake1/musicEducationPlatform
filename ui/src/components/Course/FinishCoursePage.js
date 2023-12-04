import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import Loader from '../common/Loader';
import ReviewSubmission from '../common/ReviewSubmission';
import ProfilePicture from '../Profile/components/profile_card/ProfilePicture';

const FinishCoursePage = () => {
  const { courseId } = useParams();
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const navigate = useNavigate();
  const [jwt] = useLocalStorageState('', 'jwt');
  const [course, setCourse] = useState(null);
  useEffect(() => {
    //get the course info
    httpReqAsync(`/api/v1/courses/${courseId}`, 'GET', jwt).then((result) => {
      console.log('I got the course:', result);
      setCourse(result);
    });
  }, [jwt, courseId]);

  const stars = [];
  const fullStars = Math.floor(course ? course.rating : 0);
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <ion-icon
        name="star"
        role="img"
        key={i}
        className="md hydrated"
        aria-label="star"
      />
    );
  }
  if (course ? course.rating : 0 % 1 !== 0) {
    stars.push(
      <ion-icon
        name="star-half"
        role="img"
        className="md hydrated"
        aria-label="star"
      />
    );
  }
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <ion-icon
        name="star-outline"
        role="img"
        key={i}
        className="md hydrated"
        aria-label="star"
      />
    );
  }

  return course ? (
    <>
      <div className="course-description-container">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 transition duration-300 ease-in-out hover:text-gray-600">
              Congratulations on finishing {course.courseName}!
            </h1>
            <h2 className="text-xl text-gray-700 mb-4">
              By <br />
              <div className="flex items-center justify-center relative">
                <ProfilePicture
                  imageSrc={course.author?.img_url}
                  size={50}
                  borderColor="#fff"
                />
                {course.author.username}
              </div>
            </h2>
            <h3 className="text-lg text-gray-600 mb-6">
              We would love to hear your thoughts about the course
            </h3>
          </div>
          <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-sm">
            <ReviewSubmission
              onSubmit={(reviewToSubmit) => {
                // Add a loading spinner or animation here if needed
                httpReqAsync(
                  `/api/v1/courses/${courseId}/reviews`,
                  'POST',
                  jwt,
                  reviewToSubmit
                )
                  .then((result) => {
                    // Redirect or update UI after submission
                    navigate(`/my-learnings`);
                  })
                  .finally(() => {
                    // Stop the loading spinner or animation here
                  });
              }}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>
      <Loader />
    </div>
  );
};

export default FinishCoursePage;
