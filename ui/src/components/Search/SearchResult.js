import React, { useEffect, useState } from "react";
import "./SearchResult.css";
import CoursePreviewCard from "../Course/components/CoursePreviewCard";
import TabbedPage from "../common/TabbedPage";
import SavedItemsPreviewCard from "../Saved/components/SavedItemsPreviewCard";
import UserCardSmall from "./components/UserCardSmall";
import { httpReqAsync } from "../../services/httpReqAsync";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";

const SearchResult = () => {
  const { keyword } = useParams();
  const [courses, setCourses] = useState(null);
  const [users, setUsers] = useState(null);
  const [jwt] = useLocalStorageState("", "jwt");
  const navigate = useNavigate();
  useEffect(() => {
    //search courses
    httpReqAsync(`/api/v1/courses/search/${keyword}`, "GET", jwt).then(
      (result) => {
        console.log("foundCourses:", result);
        setCourses(result);
      }
    );
    //search users
    httpReqAsync(`/api/v1/users/search/${keyword}`, "GET", jwt).then(
      (result) => {
        console.log("foundUsers:", result);
        setUsers(result);
      }
    );
  }, [jwt, keyword]);

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

  const saved = [
    {
      id: 1,
      name: "Music Theory",
      image: "https://picsum.photos/seed/picsum/200/200",
      description:
        "Learn the fundamentals of music theory with our interactive course",
    },
    {
      id: 2,
      name: "Songwriting",
      image: "https://picsum.photos/seed/picsum/200/200",
      description: "Unlock your creativity with our songwriting course",
    },
  ];
  const tabs = [
    {
      name: "courses",
      label: "Courses",
      content: courses ? (
        courses.length > 0 ? (
          <div className="my-cards-grid">
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
              // <CoursePreviewCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div>{`No course was found for keyword ${keyword}`}</div>
        )
      ) : (
        <div>Loading...</div>
      ),
    },
    {
      name: "users",
      label: "Users",
      content: users ? (
        users.length > 0 ? (
          <div className="my-cards-grid">
            <div className="usersGrid">
              {users.map((user) => (
                <UserCardSmall
                  key={user.id}
                  userId={user.id}
                  username={user.username}
                  description={user?.aboutMe}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>{`No user was found for keyword ${keyword}`}</div>
        )
      ) : (
        <div>Loading ...</div>
      ),
    },
    {
      name: "storage",
      label: "Storage",
      content:
        saved.length > 0 ? (
          <div className="my-cards-grid">
            {documents.map((document) => (
              <SavedItemsPreviewCard key={document.id} {...document} />
            ))}
          </div>
        ) : (
          <div>{`Nothing in storage was found for keyword ${keyword}`}</div>
        ),
    },
  ];

  return <TabbedPage tabs={tabs} />;
};

export default SearchResult;
