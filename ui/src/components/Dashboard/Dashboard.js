import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import CoursePreviewCard from '../Course/components/CoursePreviewCard';
import MyCourseCard from '../Course/components/MyCourseCard';
import SavedItemsPreviewCard from '../Saved/components/SavedItemsPreviewCard';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import ChatRoomList from '../Chat/components/ChatRoomList';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (jwt && currentUser) {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/taken-courses`,
        'GET',
        jwt
      ).then((result) => {
        setCourses(result);
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
    }
  }, [jwt, currentUser]);

  return (
    <div className="dashboard-container">
      <div className="section-container my-learnings">
        <h2>My Learnings</h2>
        <div className="cards-container">
          {courses.length === 0 && (
            <div className="centered">You don't have any courses yet</div>
          )}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {courses.length > 0 &&
              courses.map((course) => (
                <MyCourseCard
                  course={course}
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}/description`)}
                />
              ))}
          </div>
        </div>
        <Link to="/my-courses" className="see-all-link">
          See all of my courses
        </Link>
      </div>
      <div className="dashboard-wrapper">
        <div className="section-container saved">
          <h2>Saved Items</h2>
          <div className="saved-container">
            {/* Show only max 10 saved items */}
            {documents.slice(0, 10).map((document) => (
              <SavedItemsPreviewCard key={document.id} {...document} />
            ))}

            {documents.length === 0 && (
              <div className="centered mt-4">
                You don't have any saved items yet
              </div>
            )}
          </div>

          {/* Show "See all saved items" link only if there are more than 6 items */}
          {documents.length > 6 && (
            <Link to="/storage" className="see-all-link">
              See all saved items
            </Link>
          )}
        </div>

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
            <div className="centered">You don't have any conversations yet</div>
          )}
        </div>
      </div>
      <div className="section-container recommended-courses">
        <h2>Recommended Courses</h2>
        <div className="cards-container">
          {recommendedCourses &&
            recommendedCourses.map((course) => (
              <CoursePreviewCard
                key={course.id}
                courseId={course.id}
                img_url={course.img_url}
                authorId={course.author}
                title={course.courseName}
                takenCount={course?.enrolledStudents?.length}
                formattedCreationDate={new Date(
                  course.creationDate
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                price={course.price}
                tags={course.tags}
                onClick={() => navigate(`/courses/${course.id}/description`)}
              />
            ))}
        </div>
        <Link to="/courses" className="see-all-link">
          See all recommended courses
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
