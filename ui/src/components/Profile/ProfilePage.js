import React, { useEffect, useState } from 'react';
import './ProfilePage.css';

import ProfileCard from './components/profile_card/ProfileCard';
import About from './components/about_me/About';
import Reviews from '../common/Reviews';
import { httpReqAsync } from '../../services/httpReqAsync';
import useLocalStorageState from '../../util/useLocalStorageState';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from '../Course/components/Slider';
import Loader from '../common/Loader';

const ProfilePage = () => {
  const { userId } = useParams();
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [takenCourses, setTakenCourses] = useState([]);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    //get the basic user info
    httpReqAsync(`/api/v1/users/${userId}`, 'GET', jwt).then((result) => {
      setUser(result);
      console.log(result);
    });
  }, [toggleRefresh, jwt, userId]);
  useEffect(() => {
    //get the reviews info
    httpReqAsync(`/api/v1/users/${userId}/reviews`, 'GET', jwt).then(
      (result) => {
        setReviews(result);
      }
    );
    //get the taken courses
    httpReqAsync(`/api/v1/users/${userId}/taken-courses`, 'GET', jwt).then(
      (result) => {
        setTakenCourses(result);
      }
    );
    //get the published courses
    httpReqAsync(`/api/v1/users/${userId}/published-courses`, 'GET', jwt).then(
      (result) => {
        setPublishedCourses(result);
      }
    );
  }, [jwt, userId, navigate]);

  const handleMessage = () => {
    navigate(`/chat?otherUserId=${userId}`);
  };

  console.log('profile card loaded');

  const handleFollow = () => {
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/follow?userIdToFollow=${userId}`,
      'POST',
      jwt
    ).then(() => {
      setToggleRefresh(!toggleRefresh);
    });
  };

  const handleUnfollow = () => {
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/unfollow?userIdToUnfollow=${userId}`,
      'POST',
      jwt
    ).then(() => {
      setToggleRefresh(!toggleRefresh);
    });
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center  p-10 text-center">
        {user ? (
          <>
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white bg-gray-300">
              <img
                src={
                  user.img_url
                    ? user.img_url
                    : 'https://t4.ftcdn.net/jpg/02/17/34/67/360_F_217346796_TSg5VcYjsFxZtIDK6Qdctg3yqAapG7Xa.jpg'
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-5">
              <h1 className="text-xl font-semibold">{user.username}</h1>
              <div className="flex mt-3">
                <div className="mx-3">
                  <p className="font-bold text-2xl">
                    {user.followersIds.length}
                  </p>
                  <p className="text-gray-500">Followers</p>
                </div>
                <div className="mx-3">
                  <p className="font-bold text-2xl">
                    {user.followingsIds?.length}
                  </p>
                  <p className="text-gray-500">Following</p>
                </div>
                <div className="mx-3">
                  <p className="font-bold text-2xl">
                    {user.takenCoursesIds?.length}
                  </p>
                  <p className="text-gray-500">Taken courses</p>
                </div>
                <div className="mx-3">
                  <p className="font-bold text-2xl">
                    {user.publishedCoursesIds?.length}
                  </p>
                  <p className="text-gray-500">Published courses</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex">
              {String(currentUser.id) !== String(userId) && (
                <div className="profile-actions">
                  {user.followersIds?.includes(currentUser.id) ? (
                    <button
                      className="px-4 mr-3  py-2 rounded-full bg-green-500 text-white mr-2"
                      onClick={handleUnfollow}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="mr-3 px-4 py-2 rounded-full bg-green-500 text-white"
                      onClick={handleFollow}
                    >
                      Follow
                    </button>
                  )}

                  <button
                    className="px-4 py-2 rounded-full bg-blue-500 text-white"
                    onClick={handleMessage}
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
            <div className="card mt-5 p-5 text-left" style={{ width: '100%' }}>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">About Me</h2>
                <div className="mt-2">
                  <div className="p-2">{user?.aboutMe}</div>
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">Taken Courses</h2>
                <div className="mt-2">
                  <Slider cards={takenCourses} />
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">Published Courses</h2>
                <div className="mt-2">
                  <Slider cards={publishedCourses} />
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="mt-2">
                  {reviews && (
                    <Reviews
                      reviews={reviews}
                      currentUserCanReview={
                        String(currentUser.id) !== String(userId)
                      }
                      onSubmitReview={(reviewToSubmit) =>
                        httpReqAsync(
                          `/api/v1/users/${userId}/reviews`,
                          'POST',
                          jwt,
                          reviewToSubmit
                        ).then(() => {
                          alert('Review submitted successfully!');
                          setToggleRefresh(!toggleRefresh);
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
