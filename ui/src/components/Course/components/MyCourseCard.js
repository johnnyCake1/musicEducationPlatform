import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import "./CoursePreviewCard.css";
import ProfilePicture from "../../Profile/components/profile_card/ProfilePicture";
import { FaBookmark } from "react-icons/fa";
import { getFile, httpReqAsync } from "../../../services/httpReqAsync";
import useLocalStorageState from "../../../util/useLocalStorageState";
import { Link } from "react-router-dom";

const CourseCard = ({course}) => {
  const [showAddToSavedIcon, setShowAddToSavedIcon] = useState(false);
  const [jwt] = useLocalStorageState("", "jwt");
  const [picSrc, setPicSrc] = useState("https://via.placeholder.com/500x500");
  const [author, setAuthor] = useState(null);
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    //get current user's info
    httpReqAsync(`/api/v1/users/${currentUser?.id}`, "GET", jwt).then(
      (result) => {
        console.log('result', result)
        setIsSaved(result.savedCoursesIds.includes(course.id));
      }
    );
  }, [jwt, isSaved]);

  const toggleSaveCourse = (e) => {
    e.preventDefault();
    // if already saved then remove from saved
    if (isSaved) {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses/${course.id}`,
        "DELETE",
        jwt
      ).then((result) => {
        console.log("course saved value updated to:", !isSaved);
        setIsSaved(!isSaved);
      });
      // if not saved then save
    } else {
      httpReqAsync(
        `/api/v1/users/${currentUser.id}/saved-courses/${course.id}`,
        "POST",
        jwt
      ).then((result) => {
        console.log("course saved value updated to:", !isSaved);
        setIsSaved(!isSaved);
      });
    }
  };


  return (
    <div onMouseEnter={() => setShowAddToSavedIcon(true)}
      onMouseLeave={() => setShowAddToSavedIcon(false)} className="card uk-transition-toggle">
      <Link to={`/courses/${course.id}/description`} >
        
        <ion-icon onClick={toggleSaveCourse} class={`add-to-saved-icon ${isSaved || showAddToSavedIcon ? "visible" : ""}`} name={isSaved ? "bookmark" : "bookmark-outline"}></ion-icon>
        <div className="card-media h-40">
          <img src={course.img_url ? course.img_url : "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-21.jpg"} alt="" className="" />
          
        </div>
        <div className="card-body p-4">
          <div className="font-semibold line-clamp-2">
            {course.courseName == '' ? "NO NAME" : course.courseName}
          </div>
          <div className="flex space-x-2 items-center text-sm pt-3">
            <div> {course.courseShortDescription} </div>

          </div>
          <div className="pt-1 flex items-center justify-between">
            <div className="text-sm font-semibold"> {course.author?.firstName + " " + course.author?.lastName}</div>
            <div className="text-lg font-semibold"> ${course.price} </div>
          </div>
        </div>
        
      </Link>
      <div className="p-2 flex justify-end">
        <Link to={"/my-courses/drafts/"+course.id} href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Change
          <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </Link>
      </div>
    </div>
  );
};


export default CourseCard;