import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import CoursePreviewCard from "../Course/components/CoursePreviewCard";
import MyCourseCard from "../Course/components/MyCourseCard";
import SavedItemsPreviewCard from "../Saved/components/SavedItemsPreviewCard";
import Conversations from "../Chat/components/Conversations";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";
import { httpReqAsync } from "../../services/httpReqAsync";
const documents = [
  {
    id: 1,
    type: "pdf",
    title: "My great pdf file",
    updatedAt: "2023-05-15",
    size: "4.5MB",
    imageSrc: "https://via.placeholder.com/320x180.png?text=PDF",
  },
  {
    id: 2,
    type: "word",
    title: "My notes",
    updatedAt: "2023-05-12",
    size: "3.2MB",
    imageSrc: "https://via.placeholder.com/320x180.png?text=Note",
  },
  {
    id: 3,
    type: "powerpoint",
    title: "Cool picture",
    updatedAt: "2023-05-10",
    size: "7.8MB",
    imageSrc: "https://via.placeholder.com/320x180.png?text=PNG",
  },
];

const Dashboard = () => {
  const [courses, setCourses] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [jwt] = useLocalStorageState("", "jwt");
  const [currentUser] = useLocalStorageState(null, "currentUser");
  useEffect(() => {
    httpReqAsync(`/api/v1/conversations`, "GET", jwt).then((convs) => {
      setConversations(convs);
    });
  }, [jwt]);

  const navigate = useNavigate();
  useEffect(() => {
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/taken-courses`,
      "GET",
      jwt
    ).then((result) => {
      setCourses(result);
    });
  }, [jwt, currentUser]);

  return (
    <div className="dashboard-container">
      <div className="section-container my-learnings">
        <h2>My Learnings</h2>
        <div className="cards-container">
          {
            courses &&
              courses.map((course) => (
                <MyCourseCard
                  course={course}
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}/description`)}
                />
              ))
            // courses.map((course) => (
            //   <CoursePreviewCard
            //     key={course.id}
            //     courseId={course.id}
            //     img_url={course.img_url}
            //     authorId={course.authorId}
            //     title={course.courseName}
            //     takenCount={course?.enrolledStudents?.length}
            //     formattedCreationDate={new Date(
            //       course.creationDate
            //     ).toLocaleDateString("en-US", {
            //       year: "numeric",
            //       month: "long",
            //       day: "numeric",
            //     })}
            //     price={course.price}
            //     tags={course.tags}
            //     onClick={() => navigate(`/courses/${course.id}/description`)}
            //   />
            // ))
          }
        </div>
        <Link to="/my-courses" className="see-all-link">
          See all of my courses
        </Link>
      </div>
      <div className="section-container saved">
        <h2>Saved Items</h2>
        <div className="saved-container">
          {documents.map((document) => (
            <SavedItemsPreviewCard key={document.id} {...document} />
          ))}
        </div>
        <Link to="/storage" className="see-all-link">
          See all saved items
        </Link>
      </div>
      <div className="section-container chat">
        <h2>Chats</h2>
        {conversations && conversations.length > 0 ? (
          <Conversations
            privateChats={conversations.slice(0, 4)}
            onClick={(conv) => {
              navigate("/chat");
            }}
          />
        ) : (
          <div className="centered">You don't have any conversations yet</div>
        )}

        <Link to="/chat" className="see-all-link">
          See all of my chats
        </Link>
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
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
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
