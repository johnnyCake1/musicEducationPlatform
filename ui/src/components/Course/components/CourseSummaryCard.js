import React, { useEffect, useState } from 'react';
import './CourseSummaryCard.css';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import useLocalStorageState from '../../../util/useLocalStorageState';
import { httpReqAsync } from '../../../services/httpReqAsync';
import { useNavigate, Link } from 'react-router-dom';
import Stripe from 'react-stripe-checkout';
import { API_URL, STRIPE_KEY } from '../../../constants';
import axios from 'axios';

const CourseSummaryCard = ({
  course,
  courseId,
  name,
  description,
  reviews,
  enrolledStudentsIds,
  authorId,
  lastUpdated,
  price,
}) => {
  const [jwt] = useLocalStorageState('', 'jwt');
  // const [author, setAuthor] = useState(null);
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [enrolled, setEnrolled] = useState(
    enrolledStudentsIds.includes(currentUser.id)
  );

  const navigate = useNavigate();
  // useEffect(() => {
  //   //get the author's info
  //   httpReqAsync(`/api/v1/users/${authorId}`, 'GET', jwt).then((result) => {
  //     setAuthor(result);
  //   });
  // }, [jwt, authorId, enrolledStudentsIds, currentUser]);

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

  const handleToken = async (token) => {
    await axios
      .post(
        `${API_URL}/api/v1/courses/${courseId}/enroll?userId=${currentUser.id}`,
        '',
        {
          headers: {
            token: token.id,
            amount: price,
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then(() => {
        alert('Payment Success');
        navigate(
          `/courses/content/${courseId}/${course?.curriculum[0]?.id}/${course?.curriculum[0].courseTopics[0]?.id}`
        );
      })
      .catch((error) => {
        alert(error);
      });
  };

  const enrollCurrentUserToCourse = () => {
    httpReqAsync(
      `/api/v1/courses/${courseId}/enroll?userId=${currentUser.id}`,
      'POST',
      jwt
    ).then((result) => {
      setEnrolled(true);
      navigate(
        `/courses/content/${courseId}/${course?.curriculum[0]?.id}/${course?.curriculum[0].courseTopics[0]?.id}`
      );
    });
  };

  const dropCurrentUserFromCourse = () => {
    console.log('dropping');
    httpReqAsync(
      `/api/v1/courses/${courseId}/drop?userId=${currentUser.id}`,
      'POST',
      jwt
    ).then((result) => {
      setEnrolled(false);
    });
  };

  const handleConvertToDraft = () => {
    httpReqAsync(
      `/api/v1/courses/${courseId}/convert-to-draft`,
      'POST',
      jwt
    ).then((result) => {
      navigate(`/my-courses/drafts/${courseId}`);
    });
  };

  // Determine the button text and action based on the price

  return (
    <>
      <div className="bg-gradient-to-tr from-pink-500 to-red-500 text-white">
        <div className="container p-0">
          <div className="lg:flex items-center lg:space-x-12 lg:py-10 p-4">
            <div className="lg:w-4/12">
              <div className="w-full h-44 overflow-hidden rounded-lg relative lg:mb-0 mb-4">
                <img
                  src={
                    course.img_url
                      ? course.img_url
                      : 'https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-21.jpg'
                  }
                  alt=""
                  className="w-full h-full absolute inset-0 object-cover"
                />
              </div>
            </div>
            <div className="lg:w-8/12">
              <h1 className="lg:leading-10 lg:text-2xl text-white text-xl leading-8 font-semibold">
                {course.courseName == '' ? 'NO NAME' : course.courseName}
              </h1>
              <p className="line-clamp-2 mt-3 md:block hidden">
                {course.courseShortDescription}
              </p>
              <ul className="flex text-gray-100 gap-4 mt-4 mb-1">
                <li className="flex items-center">
                  <span className="avg bg-yellow-500 mr-2 px-2 rounded text-white font-semiold">
                    {course.rating ? course.rating : 0}
                  </span>
                  <div className="star-rating text-yellow-200 flex">
                    {stars} ({course.reviews?.length})
                  </div>
                </li>
                <li className="opacity-90">
                  {' '}
                  <ion-icon
                    name="people-circle-outline"
                    role="img"
                    className="md hydrated"
                    aria-label="people circle outline"
                  />{' '}
                  {course.enrolledStudentsIds?.length} Enrolled{' '}
                </li>
              </ul>
              <ul className="lg:flex items-center text-gray-100 mt-3 opacity-90">
                <li>
                  {'Created by: '}
                  <a
                    href="#"
                    className="text-white fond-bold hover:underline hover:text-white"
                  >
                    {course?.author.username}
                  </a>
                </li>
                <span className="lg:block hidden mx-3 text-2xl">·</span>
                <li>
                  {`Last updated: ${
                    course.lastUpdatedDate
                      ? new Date(course.lastUpdatedDate).toLocaleString()
                      : 'Unknown'
                  }`}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white border-b z-20 mb-4 overflow-hidden uk-sticky uk-active uk-sticky-fixed"
        uk-sticky="media: 992; offset:70"
        style={{ position: 'sticky', top: 65, width: 1125 }}
      >
        <div className="mcontainer py-0 lg:px-20 flex justify-between items-center">
          <nav className="cd-secondary-nav nav-smal l flex-1">
            <ul
              className="space-x-3"
              uk-scrollspy-nav="closest: li; scroll: true"
            >
              <li className="uk-active">
                <a href="#Overview" uk-scroll="">
                  Overview
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-3">
            {course.authorId === currentUser.id && (
              <button
                className="flex items-center justify-center h-9 px-6 rounded-md bg-green-200"
                onClick={handleConvertToDraft}
              >
                Edit
              </button>
            )}

            {course.authorId !== currentUser.id && (
              <>
                {enrolled ? (
                  <>
                    <Link
                      to={`/courses/content/${courseId}/${course?.curriculum[0]?.id}/${course?.curriculum[0]?.courseTopics[0]?.id}`}
                      className="flex items-center justify-center h-9 px-6 rounded-md bg-blue-600 text-white"
                    >
                      Go to the course
                    </Link>

                    <button
                      className="flex items-center justify-center h-9 px-6 rounded-md bg-red-600 text-white"
                      onClick={dropCurrentUserFromCourse}
                    >
                      (click to drop)
                    </button>
                  </>
                ) : (
                  <>
                    {price === 0 ? (
                      <button
                        className="flex items-center justify-center h-9 px-6 rounded-md bg-blue-600 text-white"
                        onClick={enrollCurrentUserToCourse}
                      >
                        Enroll for free
                      </button>
                    ) : (
                      <Link
                        to={`/pay/` + courseId}
                        className="flex items-center justify-center h-9 px-6 rounded-md bg-blue-600 text-white"
                      >
                        <i>{`$${price} - Buy`}</i>
                      </Link>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseSummaryCard;
