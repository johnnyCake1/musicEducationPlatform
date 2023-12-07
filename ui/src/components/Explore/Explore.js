import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import { Link } from 'react-router-dom';
import CourseCard from '../Course/components/CourseCard';

const Courses = () => {
  const { courseId } = useParams();
  // courses?categoryId=2
  const categoryId = new URLSearchParams(window.location.search).get(
    'categoryId'
  );
  const search = new URLSearchParams(window.location.search).get('search');
  const [jwt] = useLocalStorageState('', 'jwt');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    httpReqAsync(`/api/v1/courses/categories`, 'GET', jwt).then((result) => {
      console.log('I got the categories:', result);
      setCategories(result);
    });
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
    } else if (search) {
      httpReqAsync(`/api/v1/courses/search/${search}`, 'GET', jwt)
        .then((result) => {
          console.log('I got the course:', result);
          setCourses(result);
        })
        .catch((err) => {
          setCourses([]);
          console.log('No courses for the current search', err);
        });
    } else {
      httpReqAsync(`/api/v1/courses/filter?mostEnrollment=true`, 'GET').then((result) => {
        console.log('I got the course:', result);
        setCourses(result);
      });
    }
  }, [jwt, categoryId, search]);

  return (
    <div className=" pt-10">
      {/*  Categories */}
      {!categoryId && !search && (
        <div className="container px-4 py-10 mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Explore Different Music Categories
          </h3>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Discover a wide range of music categories and categorize courses as a tutor or learner
          </p>
          <div className="grid gap-8 my-8  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                to={`/explore-courses?categoryId=${category.id}`}
                className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center gap-x-1">
                  <img
                    src={category.img_url}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold tracking-wide text-gray-800 dark:text-white">
                        {category.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="container px-4 py-10 mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {/* category name */}
          Courses
          {categoryId && categories.length > 0
            ? ' for category: ' +
              categories.find((category) => category.id === +categoryId).name
            : ''}
          {search ? ' for search: ' + search : ' with highest number of enrolled users'}
        </h3>

        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3 noads">
          {courses.map((course) => {
            return (
              <Link to={'/explore-courses/' + course.id}>
                <div className="card p-2">
                  <div className="relative block overflow-hidden bg-gray-100 rounded-lg shadow aspect-w-16 aspect-h-10 dark:bg-gray-800">
                    <img
                      alt={course.courseName || 'Course Image'}
                      src={
                        course.img_url ||
                        'https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-21.jpg'
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <a
                        href="#" // Replace with the author's profile link
                        className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full"
                      >
                        <img
                          src={
                            course.author?.img_url ||
                            'https://t4.ftcdn.net/jpg/02/17/34/67/360_F_217346796_TSg5VcYjsFxZtIDK6Qdctg3yqAapG7Xa.jpg'
                          } // Replace with default profile image if necessary
                          alt={course.author?.username || "Author's Name"}
                          className="object-cover w-full h-full"
                        />
                      </a>
                      <div className="flex flex-col space-y-1">
                        <a
                          href="/component/table-visits" // Replace with the actual course link
                          className="font-semibold text-gray-800 transition-colors duration-300 dark:text-gray-200 sm:text-lg dark:hover:text-primary hover:text-primary hover:underline"
                        >
                          {course.courseName === ''
                            ? 'NO NAME'
                            : course.courseName}
                        </a>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Author: {course.author?.username}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      {course.price ? '$' + course.price : 'FREE'}
                    </div>
                  </div>
                </div>
              </Link>
            );
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
