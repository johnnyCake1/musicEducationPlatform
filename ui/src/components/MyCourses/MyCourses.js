import React, { useEffect, useState } from 'react';
import CoursePreviewCard from '../Course/components/CoursePreviewCard';
import TabbedPage from '../common/TabbedPage';
import { Link, useNavigate } from 'react-router-dom';
import { httpReqAsync } from '../../services/httpReqAsync';
import useLocalStorageState from '../../util/useLocalStorageState';
import './MyCourses.css';
import MyCourseCard from '../Course/components/MyCourseCard';

const MyCourses = () => {
  const navigate = useNavigate();
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [publishedCourses, setPublishedCourses] = useState(null);
  const [draftCourses, setDraftCourses] = useState(null);
  useEffect(() => {
    //get published courses
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/published-courses`,
      'GET',
      jwt
    ).then((result) => {
      setPublishedCourses(result);
    });
    //get saved courses
    httpReqAsync(
      `/api/v1/courses/draft-courses?authorId=${currentUser.id}`,
      'GET',
      jwt
    ).then((result) => {
      console.log('drafts:', result);
      setDraftCourses(result);
    });
  }, [jwt, currentUser]);

  const handleDraftCreation = () => {
    httpReqAsync(
      `/api/v1/courses/draft-courses/create-empty?authorId=${currentUser.id}`,
      'POST',
      jwt
    ).then((emptyCourseData) => {
      console.log('here is result:!', emptyCourseData);
      navigate(`/my-courses/drafts/${emptyCourseData.id}`);
    });
  };
  const tabs = [
    {
      name: 'publishedCourses',
      label: 'Published courses',
      content: (
        <>
          <div className="mb-4">
            <button
              onClick={handleDraftCreation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Click here to create a new course
            </button>
          </div>
          {publishedCourses ? (
            publishedCourses.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
                {publishedCourses.map((course) => (
                  <MyCourseCard
                    course={course}
                    onClick={() =>
                      navigate(`/courses/${course.id}/description`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex">
                {'Nothing in your published courses yet :('}
              </div>
            )
          ) : (
            <div>Loading ...</div>
          )}
        </>
      ),
    },
    {
      name: 'draftCourses',
      label: 'Draft courses',
      content: (
        <>
          <div className="mb-4">
            <button
              onClick={handleDraftCreation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Click here to create a new course
            </button>
          </div>
          {draftCourses ? (
            draftCourses.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
                {draftCourses.map((course) => (
                  <MyCourseCard
                    course={course}
                    key={course.id}
                    onClick={() => navigate(`/my-courses/drafts/${course.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex">
                {'Nothing in your published courses yet :('}
              </div>
            )
          ) : (
            <div>Loading ...</div>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="container">
        <div className="text-2xl font-semibold"> My courses </div>
        <TabbedPage tabs={tabs} />
      </div>
    </>
  );
};

export default MyCourses;
