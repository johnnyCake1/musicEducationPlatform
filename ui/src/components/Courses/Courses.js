import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";
import {  httpReqAsync } from "../../services/httpReqAsync";
import { Link } from "react-router-dom";
import CourseCard from '../Course/components/CourseCard';

const Courses = () => {
  const { courseId } = useParams();
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseVideoSrc, setCourseVideoSrc] = useState("");
  const [courseReviews, setCourseReviews] = useState(null);
  useEffect(() => {
    //get the course info
    httpReqAsync(`/api/v1/courses/`, "GET", jwt).then((result) => {
      console.log("I got the course:", result);
      setCourses(result);
    });
    httpReqAsync(`/api/v1/courses/categories`, "GET", jwt).then((result) => {
      console.log("I got the categories:", result);
      setCategories(result);
    });
    
  }, [jwt]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="container md:space-y-10 space-y-5">
      <div>
        {/* title */}
        <div className="mb-2">
          <div className="text-sm mt-2">
            {" "}
            Choose from 130 online video courses with new additions published
            every month{" "}
          </div>
        </div>
        {/* nav */}
        <nav className="cd-secondary-nav border-b md:m-0 -mx-4 nav-small">
          <ul>
            <li className="active">
              <a href="#" className="lg:px-2">
                {" "}
                Python{" "}
              </a>
            </li>
            <li>
              <a href="#" className="lg:px-2">
                {" "}
                Web development{" "}
              </a>
            </li>
            <li>
              <a href="#" className="lg:px-2">
                {" "}
                JavaScript
              </a>
            </li>
            <li>
              <a href="#" className="lg:px-2">
                {" "}
                Softwares
              </a>
            </li>
            <li>
              <a href="#" className="lg:px-2">
                {" "}
                Drawing
              </a>
            </li>
          </ul>
        </nav>
        {/*  slider */}
        <div className="mt-3">
          <div className="relative uk-slider" uk-slider="finite: true">
            <div className="uk-slider-container px-1 py-3">
              <ul
                className="uk-slider-items uk-child-width-1-3@m uk-child-width-1-2@s uk-grid-small uk-grid"
                style={{ transform: "translate3d(0px, 0px, 0px)" }}
              >
                <li tabIndex={-1} className="uk-active">
                  <a href="course-intro.html" className="uk-link-reset">
                    <div className="card uk-transition-toggle">
                      <div className="card-media h-40">
                        <div className="card-media-overly" />
                        <img
                          src="../assets/images/courses/img-1.jpg"
                          alt=""
                          className=""
                        />
                        <span className="icon-play" />
                      </div>
                      <div className="card-body p-4">
                        <div className="font-semibold line-clamp-2">
                          {" "}
                          Learn JavaScript and Express to become a professional
                          JavaScript developer.{" "}
                        </div>
                        <div className="flex space-x-2 items-center text-sm pt-3">
                          <div> 13 hours</div>
                          <div> · </div>
                          <div> 32 lectures </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <div className="text-sm font-medium"> John Michael </div>
                          <div className="text-lg font-semibold"> $14.99 </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
                <li tabIndex={-1} className="uk-active">
                  <a href="course-intro.html" className="uk-link-reset">
                    <div className="card uk-transition-toggle">
                      <div className="card-media h-40">
                        <div className="card-media-overly" />
                        <img
                          src="../assets/images/courses/img-2.jpg"
                          alt=""
                          className=""
                        />
                        <span className="icon-play" />
                      </div>
                      <div className="card-body p-4">
                        <div className="font-semibold line-clamp-2">
                          Learn Angular Fundamentals From beginning to advance{" "}
                        </div>
                        <div className="flex space-x-2 items-center text-sm pt-3">
                          <div> 26 hours</div>
                          <div>·</div>
                          <div> 26 lectures </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {" "}
                            Stella Johnson{" "}
                          </div>
                          <div className="text-lg font-semibold"> $18.99</div>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
                <li tabIndex={-1} className="uk-active">
                  <a href="course-intro.html" className="uk-link-reset">
                    <div className="card uk-transition-toggle">
                      <div className="card-media h-40">
                        <div className="card-media-overly" />
                        <img
                          src="../assets/images/courses/img-3.jpg"
                          alt=""
                          className=""
                        />
                        <span className="icon-play" />
                      </div>
                      <div className="card-body p-4">
                        <div className="font-semibold line-clamp-2">
                          Responsive Web Design Essentials HTML5 CSS3 Bootstrap{" "}
                        </div>
                        <div className="flex space-x-2 items-center text-sm pt-3">
                          <div> 18 hours</div>
                          <div>·</div>
                          <div> 42 lectures </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <div className="text-sm font-medium"> Monroe Parker </div>
                          <div className="text-lg font-semibold"> $11.99 </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
                <li tabIndex={-1} className="">
                  <a href="course-intro.html" className="uk-link-reset">
                    <div className="card uk-transition-toggle">
                      <div className="card-media h-40">
                        <div className="card-media-overly" />
                        <img
                          src="../assets/images/courses/img-1.jpg"
                          alt=""
                          className=""
                        />
                        <span className="icon-play" />
                      </div>
                      <div className="card-body p-4">
                        <div className="font-semibold line-clamp-2">
                          {" "}
                          Learn JavaScript and Express to become a professional
                          JavaScript developer.{" "}
                        </div>
                        <div className="flex space-x-2 items-center text-sm pt-3">
                          <div> 32 hours</div>
                          <div>·</div>
                          <div> lec 4 </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <div className="text-sm font-medium"> Jesse Stevens </div>
                          <div className="text-lg font-semibold"> $29.99 </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
              {/* slide icons */}
              <a
                className="absolute bg-white top-1/4 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible"
                href="#"
                uk-slider-item="previous"
              >
                {" "}
                <i className="icon-feather-chevron-left" />
              </a>
              <a
                className="absolute bg-white top-1/4 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white"
                href="#"
                uk-slider-item="next"
              >
                {" "}
                <i className="icon-feather-chevron-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/*  Categories */}
      <div>
        <div className="sm:my-8 my-3 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold"> Categories </h2>
            <p className="font-medium text-gray-500 leading-6">
              {" "}
              Find a topic by browsing top categories.{" "}
            </p>
          </div>
          <a href="#" className="text-blue-500 sm:block hidden">
            {" "}
            See all{" "}
          </a>
        </div>
        <div className="relative -mt-3 uk-slider" uk-slider="finite: true">
          <div className="uk-slider-container px-1 py-3">
            <ul
              className="uk-slider-items uk-child-width-1-5@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid"
              style={{ transform: "translate3d(0px, 0px, 0px)" }}
            >
              {categories.map((category) => {
                return(
                  <li tabIndex={-1} key={category.id} className="uk-active">
                    <div className="rounded-md overflow-hidden relative w-full h-36">
                      <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                      <img
                        src={category.img_url}
                        className="absolute w-full h-full object-cover"
                        alt=""
                      />
                      <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                        {" "}
                        {category.name}
                      </div>
                    </div>
                  </li>
                )
              })}
              
              
              
            </ul>
          </div>
          <a
            className="absolute bg-white top-16 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible"
            href="#"
            uk-slider-item="previous"
          >
            {" "}
            <i className="icon-feather-chevron-left" />
          </a>
          <a
            className="absolute bg-white top-16 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white"
            href="#"
            uk-slider-item="next"
          >
            {" "}
            <i className="icon-feather-chevron-right" />
          </a>
        </div>
      </div>
      <div>
        <div className="md:flex justify-between items-center mb-8 pt-4 border-t">
          <div>
            <div className="text-xl font-semibold"> Courses </div>
            <div className="text-sm mt-2 font-medium text-gray-500 leading-6">
              {" "}
              Choose from +10.000 courses with new additions published every months
            </div>
          </div>
        </div>
        {/* course list */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {courses.map((course) => {
            return (
              <CourseCard key={course.id} course={course} />
            )
          })}
          
          
        </div>
        
      </div>
    </div>

  );
};

export default Courses;
