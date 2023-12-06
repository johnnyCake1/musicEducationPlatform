import React, { useEffect, useState } from 'react';
import './SearchResult.css';
import CoursePreviewCard from '../Course/components/CoursePreviewCard';
import TabbedPage from '../common/TabbedPage';
import SavedItemsPreviewCard from '../Saved/components/SavedItemsPreviewCard';
import UserCardSmall from './components/UserCardSmall';
import { httpReqAsync } from '../../services/httpReqAsync';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import CourseCard from '../Course/components/CourseCard';
import Loader from '../common/Loader';

const SearchResult = () => {
  const { keyword } = useParams();
  const [courses, setCourses] = useState(null);
  const [users, setUsers] = useState(null);
  const [jwt] = useLocalStorageState('', 'jwt');
  const navigate = useNavigate();
  useEffect(() => {
    //search courses
    httpReqAsync(`/api/v1/courses/search/${keyword}`, 'GET', jwt).then(
      (result) => {
        console.log('foundCourses:', result);
        setCourses(result);
      }
    );
    //search users
    httpReqAsync(`/api/v1/users/search/${keyword}`, 'GET', jwt).then(
      (result) => {
        console.log('foundUsers:', result);
        setUsers(result);
      }
    );

    //search saved items
    // httpReqAsync(`api/v1/files/user-storage/${keyword}`, 'GET', jwt).then(
    //   (result) => {
    //     console.log('foundUsers:', result);
    //     setUsers(result);
    //   }
    // );
  }, [jwt, keyword]);

  const tabs = [
    {
      name: 'courses',
      label: 'Courses',
      content: courses ? (
        courses.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {courses
              .filter((course) => course.published)
              .map((course) => (
                <CourseCard
                  course={course}
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}/description`)}
                />
              ))}
          </div>
        ) : (
          <div>{`No course was found for keyword ${keyword}`}</div>
        )
      ) : (
        <div>
          <Loader />
        </div>
      ),
    },
    {
      name: 'users',
      label: 'Users',
      content: users ? (
        users.length > 0 ? (
          <div className="my-cards-grid">
            <div className="usersGrid">
              {users.map((user) => (
                <UserCardSmall
                  key={user.id}
                  userId={user.id}
                  img_url={user.img_url}
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
        <div>
          <Loader />
        </div>
      ),
    },
    // {
    //   name: 'storage',
    //   label: 'Storage',
    //   content:
    //     saved.length > 0 ? (
    //       <div className="my-cards-grid">
    //         {documents.map((document) => (
    //           <SavedItemsPreviewCard key={document.id} {...document} />
    //         ))}
    //       </div>
    //     ) : (
    //       <div>{`Nothing in storage was found for keyword ${keyword}`}</div>
    //     ),
    // },
  ];
  return (
    <div className="container">
      <div className="text-2xl font-semibold"> Results for {keyword} </div>
      <TabbedPage tabs={tabs} />
    </div>
  );
};

export default SearchResult;
