import React, { useEffect, useState } from 'react';
import TabbedPage from '../common/TabbedPage';
import { useNavigate } from 'react-router-dom';
import { httpReqAsync } from '../../services/httpReqAsync';
import useLocalStorageState from '../../util/useLocalStorageState';
import './MyLearnings.css';
import CourseCard from '../Course/components/MyCourseCard';
import Loader from '../common/Loader';

const MyLearnings = () => {
  //TODO: implement finished courses filter
  const finishedCourses = [];
  const navigate = useNavigate();
  const [jwt] = useLocalStorageState('', 'jwt');
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [takenCourses, setTakenCourses] = useState(null);
  const [savedCourses, setSavedCourses] = useState(null);
  useEffect(() => {
    //get taken courses
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/taken-courses`,
      'GET',
      jwt
    ).then((result) => {
      setTakenCourses(result);
    });
    //get saved courses
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/saved-courses`,
      'GET',
      jwt
    ).then((result) => {
      setSavedCourses(result);
    });
  }, [jwt, currentUser]);

  const archived = [];

  const tabs = [
    {
      name: 'takenCourses',
      label: 'Taken courses',
      content: takenCourses ? (
        takenCourses.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {takenCourses.map((course) => (
              <CourseCard
                course={course}
                key={course.id}
                courseId={course.id}
                authorId={course.author}
                title={course.courseName}
                takenCount={course?.enrolledStudents?.length}
                formattedCreationDate={new Date(
                  course.creationDate
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                price={course.price}
                tags={course.tags}
                onClick={() => navigate(`/courses/${course.id}/description`)}
              />
            ))}
          </div>
        ) : (
          <div>{'Nothing in your taken courses yet :('}</div>
        )
      ) : (
        <div>
          <Loader />
        </div>
      ),
    },
    // {
    //   name: 'finishedCourses',
    //   label: 'Finished courses',
    //   content:
    //     finishedCourses.length > 0 ? (
    //       <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
    //         {finishedCourses.map((course) => (
    //           <CourseCard
    //             course={course}
    //             key={course.id}
    //             courseId={course.id}
    //             authorId={course.author}
    //             title={course.courseName}
    //             takenCount={course?.enrolledStudents?.length}
    //             formattedCreationDate={new Date(
    //               course.creationDate
    //             ).toLocaleDateString('en-US', {
    //               year: 'numeric',
    //               month: 'long',
    //               day: 'numeric',
    //             })}
    //             price={course.price}
    //             tags={course.tags}
    //             onClick={() => navigate(`/courses/${course.id}/description`)}
    //           />
    //         ))}
    //       </div>
    //     ) : (
    //       <div>{'Nothing in your finished courses yet :('}</div>
    //     ),
    // },
    {
      name: 'saveCourses',
      label: 'Saved courses',
      content: savedCourses ? (
        savedCourses.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {savedCourses.map((course) => (
              <CourseCard
                course={course}
                key={course.id}
                courseId={course.id}
                authorId={course.author}
                title={course.courseName}
                takenCount={course?.enrolledStudents?.length}
                formattedCreationDate={new Date(
                  course.creationDate
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                price={course.price}
                tags={course.tags}
                onClick={() => navigate(`/courses/${course.id}/description`)}
              />
            ))}
          </div>
        ) : (
          <div>{'Nothing in your saved courses yet :('}</div>
        )
      ) : (
        <div>
          <Loader />
        </div>
      ),
    },
    // {
    //   name: "archived",
    //   label: "Archived",
    //   content:
    //     archived.length > 0 ? (
    //       <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
    //         {archived.map((course) => (
    //           <CourseCard course={course}  key={course.id} {...course} />
    //         ))}
    //       </div>
    //     ) : (
    //       <div>{"Nothing in your archives yet :("}</div>
    //     ),
    // },
  ];
  return (
    <div className="container">
      <div className="text-2xl font-semibold"> My Learnings </div>
      <TabbedPage tabs={tabs} />
    </div>
  );
};

export default MyLearnings;
