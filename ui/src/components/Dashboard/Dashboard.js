import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import CoursePreviewCard from "../Course/components/CoursePreviewCard";
import SavedItemsPreviewCard from "../Saved/components/SavedItemsPreviewCard";
import Conversations from "../Chat/components/Conversations";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";
import { httpReqAsync } from "../../services/httpReqAsync";

const courses = [
  {
    id: 1,
    imageSrc: "https://via.placeholder.com/320x140.png?text=Course+1",
    userImageSrc: "https://via.placeholder.com/40.png?text=User+1",
    title: "Course 1",
    username: "User 1",
    takenCount: 500,
    createdAt: "May 1, 2023",
    tags: ["Guitar", "Advanced", "Jazz"],
    price: 25,
    progress: 50,
  },
  {
    id: 2,
    imageSrc: "https://via.placeholder.com/320x140.png?text=Course+2",
    userImageSrc: "https://via.placeholder.com/40.png?text=User+2",
    title: "Course 2",
    username: "User 2",
    takenCount: 1000,
    createdAt: "April 15, 2023",
    tags: ["Piano", "Beginner", "Classical"],
    price: 0,
    progress: 10,
  },
  // Add more courses here
];

const recommendedCourses = [
  {
    id: 1,
    imageSrc: "https://via.placeholder.com/320x140.png?text=Course+3",
    userImageSrc: "https://via.placeholder.com/40.png?text=User+3",
    title: "Course 3",
    username: "User 3",
    takenCount: 250,
    createdAt: "May 5, 2023",
    tags: ["Drums", "Intermediate", "Rock"],
    price: 20,
  },
  {
    id: 2,
    imageSrc: "https://via.placeholder.com/320x140.png?text=Course+4",
    userImageSrc: "https://via.placeholder.com/40.png?text=User+4",
    title: "Course 4",
    username: "User 4",
    takenCount: 750,
    createdAt: "April 20, 2023",
    tags: ["Singing", "Advanced", "Pop"],
    price: 50,
  },
  // Add more courses here
];

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
  const [conversations, setConversations] = useState([]);
  const [jwt] = useLocalStorageState("", "jwt");
  const [currentUser] = useLocalStorageState(null, "currentUser");
  useEffect(() => {
    httpReqAsync(`api/v1/conversations`, "GET", jwt).then((convs) => {
      setConversations(convs);
      console.log("tge convs:", convs);
    });
  }, [jwt]);

  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/taken-courses`,
      "GET",
      jwt
    ).then((result) => {
      console.log("result:", result);
      setCourses(result);
    });
  }, [jwt, currentUser]);

  if (!courses) {
    return <></>;
  }

  return (
    <div className="dashboard-container">
      <div className="section-container my-learnings">
        <h2>My Learnings</h2>
        <div className="cards-container">
          {courses.map((course) => (
            <CoursePreviewCard
              key={course.id}
              courseId={course.id}
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
            conversations={conversations.slice(0, 4)}
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
          {recommendedCourses.map((course) => (
            <CoursePreviewCard key={course.id} {...course} />
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
