import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import { Link } from 'react-router-dom';
import CourseCard from '../Course/components/CourseCard';

const Courses = () => {
  const { courseId, categoryId } = useParams();
  // courses?categoryId=2

  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [jwt] = useLocalStorageState('', 'jwt');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseVideoSrc, setCourseVideoSrc] = useState('');
  const [courseReviews, setCourseReviews] = useState(null);
  useEffect(() => {
    //get the course info
    // httpReqAsync(`/api/v1/courses/`, 'GET', jwt).then((result) => {
    //   console.log('I got the course:', result);
    //   setCourses(result);
    // });
    if (categoryId) {
      httpReqAsync(
        `/api/v1/courses/categories/${categoryId}/get-courses`,
        'GET',
        jwt
      )
        .then((result) => {
          console.log('I got the course:', result);
          setCourses(result);
        })
        .catch((err) => {
          setCourses([]);
          console.log('No courses for the current category', err);
        });
    } else {
      httpReqAsync(`/api/v1/courses/`, 'GET', jwt).then((result) => {
        console.log('I got the course:', result);
        setCourses(result);
      });
    }
    httpReqAsync(`/api/v1/courses/categories`, 'GET', jwt).then((result) => {
      console.log('I got the categories:', result);
      setCategories(result);
    });
  }, [jwt, categoryId]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container md:space-y-10 space-y-5">
      {/*  Categories */}
      {!categoryId && (
        <div>
          <div>
            {/* title */}
            <div className="mb-2">
              <div className="text-sm mt-2">
                {' '}
                Choose from 130 online video courses with new additions
                published every month{' '}
              </div>
            </div>
            {/* nav */}
          </div>
          <div className="sm:my-8 my-3 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold"> Categories </h2>
              <p className="font-medium text-gray-500 leading-6">
                {' '}
                Find a topic by browsing top categories.{' '}
              </p>
            </div>
            <a href="#" className="text-blue-500 sm:block hidden">
              {' '}
              See all{' '}
            </a>
          </div>
          <div className="relative -mt-3 uk-slider" uk-slider="finite: true">
            <div className="uk-slider-container px-1 py-3">
              <ul
                className="uk-slider-items uk-child-width-1-5@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid"
                style={{ transform: 'translate3d(0px, 0px, 0px)' }}
              >
                {categories.map((category) => {
                  return (
                    <li tabIndex={-1} key={category.id} className="uk-active">
                      <Link to={'/courses/categories/' + category.id}>
                        <div className="rounded-md overflow-hidden relative w-full h-36">
                          <div className="absolute w-full h-3/4 -bottom-12 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                          <img
                            src={category.img_url}
                            className="absolute w-full h-full object-cover"
                            alt=""
                          />
                          <div className="absolute bottom-0 w-full p-3 text-white z-20 font-semibold text-lg">
                            {' '}
                            {category.name}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <a
              className="absolute bg-white top-16 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible"
              href="#"
              uk-slider-item="previous"
            >
              {' '}
              <i className="icon-feather-chevron-left" />
            </a>
            <a
              className="absolute bg-white top-16 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white"
              href="#"
              uk-slider-item="next"
            >
              {' '}
              <i className="icon-feather-chevron-right" />
            </a>
          </div>
        </div>
      )}
      <div>
        <div className="md:flex justify-between items-center mb-8 pt-4 border-t">
          <div>
            <div className="text-xl font-semibold">
              {/* category name */}
              Courses
              {categoryId && categories.length > 0
                ? ' for category: ' +
                  categories.find((category) => category.id === +categoryId)
                    .name
                : ''}
            </div>
            {!categoryId && (
              <div className="text-sm mt-2 font-medium text-gray-500 leading-6">
                Choose from +10.000 courses with new additions published every
                months
              </div>
            )}
          </div>
        </div>
        {/* course list */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {courses.map((course) => {
            return <CourseCard key={course.id} course={course} />;
          })}
          {courses.length === 0 && (
            <div className="centered mt-4 mb-4">
              There are no courses for this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
