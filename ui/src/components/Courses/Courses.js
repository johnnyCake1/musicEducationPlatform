import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useLocalStorageState from "../../util/useLocalStorageState";
import { getFile, httpReqAsync } from "../../services/httpReqAsync";

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
          <div className="text-xl font-semibold">
            {" "}
            The world's largest selection of courses
          </div>
          <div className="text-sm mt-2">
            {" "}
            Choose from 130,000 online video courses with new additions published
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
              <li tabIndex={-1} className="uk-active">
                <div className="rounded-md overflow-hidden relative w-full h-36">
                  <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                  <img
                    src="../assets/images/category/design.jpg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                    {" "}
                    Design{" "}
                  </div>
                </div>
              </li>
              <li tabIndex={-1} className="uk-active">
                <div className="rounded-md overflow-hidden relative w-full h-36">
                  <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                  <img
                    src="../assets/images/category/marketing.jpg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                    {" "}
                    Marketing{" "}
                  </div>
                </div>
              </li>
              <li tabIndex={-1} className="uk-active">
                <div className="rounded-md overflow-hidden relative w-full h-36">
                  <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                  <img
                    src="../assets/images/category/it-and-software.jpg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                    {" "}
                    Software
                  </div>
                </div>
              </li>
              <li tabIndex={-1} className="uk-active">
                <div className="rounded-md overflow-hidden relative w-full h-36">
                  <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                  <img
                    src="../assets/images/category/music.jpg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                    {" "}
                    Music{" "}
                  </div>
                </div>
              </li>
              <li tabIndex={-1} className="uk-active">
                <div className="rounded-md overflow-hidden relative w-full h-36">
                  <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                  <img
                    src="../assets/images/category/business.jpg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                    {" "}
                    Travel{" "}
                  </div>
                </div>
              </li>
              <li tabIndex={-1} className="">
                <div className="rounded-md overflow-hidden relative w-full h-36">
                  <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                  <img
                    src="../assets/images/category/development.jpg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                    {" "}
                    Development{" "}
                  </div>
                </div>
              </li>
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
          <div className="flex items-center justify-end">
            {courses.map((course)=>{
              return (
                <div className="bg-gray-100 border inline-flex p-0.5 rounded-md text-lg self-center">
                  <a
                    href="courses-list.html"
                    className="py-1.5 px-2.5 rounded-md"
                    data-tippy-placement="top"
                    data-tippy=""
                    data-original-title="List view"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="py-1.5 px-2.5 rounded-md bg-white shadow"
                    data-tippy-placement="top"
                    data-tippy=""
                    data-original-title="Grid view"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </a>
                </div>
              )
            })}
            
            <a
              href="#"
              className="bg-gray-100 border ml-2 px-3 py-2 rounded-md"
              data-tippy-placement="top"
              uk-toggle="target: #course-filter;flip: true"
              data-tippy=""
              data-original-title="Filter"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        {/* course list */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          <a href="course-intro.html" className="uk-link-reset">
            <div className="card uk-transition-toggle">
              <div className="card-media h-40">
                <div className="card-media-overly" />
                <img src="../assets/images/courses/img-4.jpg" alt="" className="" />
                <span className="icon-play" />
              </div>
              <div className="card-body p-4">
                <div className="font-semibold line-clamp-2">
                  {" "}
                  Learn Angular Fundamentals From beginning to advance lavel
                </div>
                <div className="flex space-x-2 items-center text-sm pt-3">
                  <div> 32 hours </div>
                  <div>·</div>
                  <div> lec 4 </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold"> Jesse Stevens</div>
                  <div className="text-lg font-semibold"> $29.99 </div>
                </div>
              </div>
            </div>
          </a>
          <a href="course-intro.html" className="uk-link-reset">
            <div className="card uk-transition-toggle">
              <div className="card-media h-40">
                <div className="card-media-overly" />
                <img src="../assets/images/courses/img-6.jpg" alt="" className="" />
                <span className="icon-play" />
              </div>
              <div className="card-body p-4">
                <div className="font-semibold line-clamp-2">
                  Build Responsive Real World Websites with HTML5 and CSS3{" "}
                </div>
                <div className="flex space-x-2 items-center text-sm pt-3">
                  <div> 13 hours </div>
                  <div>·</div>
                  <div>32 lectures </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold"> John Michael </div>
                  <div className="text-lg font-semibold"> $14.99 </div>
                </div>
              </div>
            </div>
          </a>
          <a href="course-intro.html" className="uk-link-reset">
            <div className="card uk-transition-toggle">
              <div className="card-media h-40">
                <div className="card-media-overly" />
                <img src="../assets/images/courses/img-5.jpg" alt="" className="" />
                <span className="icon-play" />
              </div>
              <div className="card-body p-4">
                <div className="font-semibold line-clamp-2">
                  C# Developers Double Your Coding Speed with Visual Studio{" "}
                </div>
                <div className="flex space-x-2 items-center text-sm pt-3">
                  <div> 18 hours </div>
                  <div>·</div>
                  <div>42 lectures </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold"> Stella Johnson</div>
                  <div className="text-lg font-semibold"> $18.99 </div>
                </div>
              </div>
            </div>
          </a>
          <a href="course-intro.html" className="uk-link-reset">
            <div className="card uk-transition-toggle">
              <div className="card-media h-40">
                <div className="card-media-overly" />
                <img src="../assets/images/courses/img-1.jpg" alt="" className="" />
                <span className="icon-play" />
              </div>
              <div className="card-body p-4">
                <div className="font-semibold line-clamp-2">
                  {" "}
                  Learn JavaScript and Express to become a professional JavaScript
                  developer.{" "}
                </div>
                <div className="flex space-x-2 items-center text-sm pt-3">
                  <div> 13 hours </div>
                  <div>·</div>
                  <div>32 lectures </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold"> John Michael</div>
                  <div className="text-lg font-semibold"> $14.99 </div>
                </div>
              </div>
            </div>
          </a>
          <a href="course-intro.html" className="uk-link-reset">
            <div className="card uk-transition-toggle">
              <div className="card-media h-40">
                <div className="card-media-overly" />
                <img src="../assets/images/courses/img-2.jpg" alt="" className="" />
                <span className="icon-play" />
              </div>
              <div className="card-body p-4">
                <div className="font-semibold line-clamp-2">
                  {" "}
                  Learn and Understand AngularJS to become a professional developer
                </div>
                <div className="flex space-x-2 items-center text-sm pt-3">
                  <div> 26 hours </div>
                  <div>·</div>
                  <div>26 lectures </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold"> Stella Johnson</div>
                  <div className="text-lg font-semibold"> $18.99 </div>
                </div>
              </div>
            </div>
          </a>
          <a href="course-intro.html" className="uk-link-reset">
            <div className="card uk-transition-toggle">
              <div className="card-media h-40">
                <div className="card-media-overly" />
                <img src="../assets/images/courses/img-3.jpg" alt="" className="" />
                <span className="icon-play" />
              </div>
              <div className="card-body p-4">
                <div className="font-semibold line-clamp-2">
                  Responsive Web Design Essentials HTML5 CSS3 and Bootstrap{" "}
                </div>
                <div className="flex space-x-2 items-center text-sm pt-3">
                  <div> 18 hours </div>
                  <div>·</div>
                  <div>42 lectures </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold"> Monroe Parker </div>
                  <div className="text-lg font-semibold"> $11.99 </div>
                </div>
              </div>
            </div>
          </a>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-9 space-x-2 text-base font-semibold text-gray-400 items-center">
          <a href="#" className="py-1 px-3 bg-gray-200 rounded text-gray-600">
            {" "}
            1
          </a>
          <a href="#" className="py-1 px-2 bg-gray-200 rounded">
            {" "}
            2
          </a>
          <a href="#" className="py-1 px-2 bg-gray-200 rounded">
            {" "}
            3
          </a>
          <ion-icon
            name="ellipsis-horizontal"
            className="text-lg -mb-4 md hydrated"
            role="img"
            aria-label="ellipsis horizontal"
          />
          <a href="#" className="py-1 px-2 bg-gray-200 rounded">
            {" "}
            12
          </a>
        </div>
      </div>
    </div>

  );
};

export default Courses;
