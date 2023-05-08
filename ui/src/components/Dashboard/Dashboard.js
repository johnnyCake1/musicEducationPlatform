import React from "react";
import "./Dashboard.css";
import { FaSave, FaUserFriends } from "react-icons/fa";
import { BsBookmarkFill } from "react-icons/bs";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="learnings-section">
        <h2>My Learnings</h2>
        <div className="learning-cards">
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="learning-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
        </div>
      </div>
      <div className="saved-section">
        <h2>Saved</h2>
        <div className="saved-items">
          <div className="saved-item">
            <FaSave className="save-icon" />
            <p>Note Title</p>
          </div>
          <div className="saved-item">
            <img src="https://picsum.photos/200/300" alt="saved" />
          </div>
          <div className="saved-item">
            <BsBookmarkFill className="bookmark-icon" />
            <p>Video Title</p>
          </div>
        </div>
      </div>
      <div className="chats-section">
        <h2>Chats</h2>
        <div className="chat-items">
          <div className="chat-item">
            <img src="https://picsum.photos/50/50" alt="profile" />
            <div className="chat-info">
              <p className="chat-username">Username</p>
              <p className="chat-preview">Lorem ipsum dolor sit amet...</p>
            </div>
          </div>
          <div className="chat-item">
            <img src="https://picsum.photos/50/50" alt="profile" />
            <div className="chat-info">
              <p className="chat-username">Username</p>
              <p className="chat-preview">Lorem ipsum dolor sit amet...</p>
            </div>
          </div>
          <div className="chat-item">
            <img src="https://picsum.photos/50/50" alt="profile" />
            <div className="chat-info">
              <p className="chat-username">Username</p>
              <p className="chat-preview">Lorem ipsum dolor sit amet...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="recommended-section">
        <h2>Recommended Courses</h2>
        <div className="recommended-cards">
          <div className="recommended-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="recommended-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
          <div className="recommended-card">
            <img src="https://picsum.photos/200/300" alt="course" />
            <h3>Course Name</h3>
            <p>Course Description</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
