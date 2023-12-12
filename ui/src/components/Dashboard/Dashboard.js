import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import MyCourseCard from '../Course/components/MyCourseCard';
import SavedItemsPreviewCard from '../Saved/components/SavedItemsPreviewCard';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import ChatRoomList from '../Chat/components/ChatRoomList';
import CourseCard from '../Course/components/CourseCard';
import Transactions from '../Transactions/Transactions';

const Dashboard = () => {
  const [takenCourses, setTakenCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (jwt && currentUser) {
      httpReqAsync(
        `/api/v1/purchase-records/${currentUser.id}`,
        'GET',
        jwt
      ).then((result) => {
        console.log('result', result);
      });
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/taken-courses`,
        'GET',
        jwt
      ).then((result) => {
        setTakenCourses(result);
      });
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses`,
        'GET',
        jwt
      ).then((result) => {
        setSavedCourses(result);
      });
      httpReqAsync(`/api/v1/messages/${currentUser.id}`, 'GET', jwt)
        .then((result) => {
          setChatRooms(result || []);
        })
        .catch((err) => {
          console.log('No chats for the current user', err);
        });
      httpReqAsync(`/api/v1/files/user-storage/${currentUser.id}`, 'GET', jwt)
        .then((result) => {
          setDocuments(result);
        })
        .catch((err) => {
          console.log('No files for the current user', err);
        });
      httpReqAsync(
        `/api/v1/courses/recommendations?userId=${currentUser.id}`,
        'GET',
        jwt
      )
        .then((result) => {
          setRecommendedCourses(result);
        })
        .catch((err) => {
          console.log('No files for the current user', err);
        });
    }
  }, [jwt, currentUser]);

  return (
    <div className="dashboard-container">
      <div className="section-container my-learnings">
        <h2>My Learnings</h2>
        <div className="cards-container">
          {takenCourses.length === 0 && (
            <div className="centered">You don't have any taken courses yet</div>
          )}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {takenCourses.length > 0 &&
              takenCourses.map((course) => (
                <MyCourseCard
                  course={course}
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}/description`)}
                />
              ))}
          </div>
        </div>
        {takenCourses.length >= 3 && (
          <Link to="/my-courses" className="see-all-link">
            See all of my courses
          </Link>
        )}
      </div>
      <div className="dashboard-wrapper">
        {/*Implement Saved Items: */}
        {/* <div className="section-container saved">
          <h2>Saved Items</h2>
          <div className="saved-container">
            {documents.slice(0, 10).map((document) => (
              <SavedItemsPreviewCard key={document.id} {...document} />
            ))}

            {documents.length === 0 && (
              <div className="centered mt-4 mb-4">
                You don't have any saved items yet
              </div>
            )}
          </div>

          {documents.length > 6 && (
            <Link to="/storage" className="see-all-link">
              See all saved items
            </Link>
          )}
        </div> */}

        <div className="section-container chat">
          <h2>Chats</h2>
          {chatRooms && chatRooms.length > 0 ? (
            <>
              <ChatRoomList chatRooms={chatRooms} />
              {chatRooms.length > 5 && (
                <Link to="/chat" className="see-all-link">
                  See all of my chats
                </Link>
              )}
            </>
          ) : (
            <div className="centered  mt-4 mb-4">
              You don't have any conversations yet
            </div>
          )}
        </div>

        <div className="section-container">
          <Transactions />
        </div>

      </div>
      <div className="section-container recommended-courses">
        <h2>Recommended Courses</h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-5 p-3">
          {recommendedCourses &&
            recommendedCourses
              .filter((course) => course.authorId !== currentUser?.id)
              .map((course) => <CourseCard course={course} />)}
        </div>
      </div>

      
      <div className="section-container my-learnings">
        <h2>Saved courses</h2>
        <div className="cards-container">
          {savedCourses.length === 0 && (
            <div className="centered">You don't have any saved courses yet</div>
          )}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {savedCourses.length > 0 &&
              savedCourses.map((course) => (
                <MyCourseCard
                  course={course}
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}/description`)}
                />
              ))}
          </div>
        </div>
        {savedCourses.length >= 3 && (
          <Link to="/my-courses" className="see-all-link">
            See all of the saved courses
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
