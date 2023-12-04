import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import VideoPlayer from './VideoPlayer';
import Exam from './Quiz';

// fetch('http://212.118.52.67:8080/api/v1/courses', {
//   headers: {
//     accept: '*/*',
//     'accept-language': 'en-US,en;q=0.9',
//     authorization:
//       'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjg1MzYyMjcxLCJpYXQiOjE2ODUyOTAyNzF9.yaxz7RKTdvMU572qNIsuIGqN-Z_FTYG6EYk2xneUvRI',
//     'content-type': 'application/json',
//   },
//   referrer: 'http://localhost:3002/',
//   referrerPolicy: 'strict-origin-when-cross-origin',
//   body: '{"id":13,"authorId":1,"author":{"id":1,"accessToken":null,"startDate":"2023-05-25T23:41:55.870+00:00","username":"zheenbek_akimzhanov","firstName":null,"lastName":null,"aboutMe":"jk","tags":[],"followersIds":[3],"followingsIds":[],"publishedCoursesIds":[],"takenCoursesIds":[],"savedCoursesIds":[],"draftCoursesIds":[3,7,13],"storedFilesIds":null,"authorities":[],"img_url":"http://localhost:8080/files/zheenbek_akimzhanov-ac407020-68e3-4863-8451-bb7319ce3f1c.png"},"price":0,"courseName":"Introduction to Guitar","courseShortDescription":"Learn the basics of playing the guitar.","courseLongDescription":"In this course, you will learn the fundamental techniques and concepts of playing the guitar. Whether you\'re a beginner or have some experience, this course will help you develop your skills and become a confident guitarist.","category":null,"promoVideoId":52,"previewImageId":53,"enrolledStudentsIds":[],"savedInStudentsIds":[],"enrolledStudents":[],"curriculum":[{"id":58,"moduleName":"Module 1: Getting Started","courseTopics":[{"id":171,"topicName":"Tuning the Guitar","contentData":{"id":171,"contentType":"FILE","fileId":56,"quiz":null,"file_url":"http://localhost:8080/files/Tuning the Guitar-cdc32c39-cc5b-4f09-9d2e-f8a2ddf2eaa7.png","file":{}}}]},{"id":59,"moduleName":"Module 2: Basic Chords","courseTopics":[{"id":173,"topicName":"Common Chord Progressions","contentData":{"id":173,"contentType":"FILE","fileId":59,"quiz":null,"file_url":"http://localhost:8080/files/Common Chord Progressions-c9976aff-08e9-466e-a909-3f152d10f168.png","file":{}}},{"id":172,"topicName":"Strumming Patterns","contentData":{"id":172,"contentType":"FILE","fileId":58,"quiz":null,"file_url":"http://localhost:8080/files/Strumming Patterns-4da24f5a-3db5-43c0-b48b-bd201b147f9f.png","file":{}}}]},{"id":60,"moduleName":"Module 3: Techniques and Styles","courseTopics":[{"id":174,"topicName":"Fingerpicking","contentData":{"id":174,"contentType":"FILE","fileId":60,"quiz":null,"file_url":"http://localhost:8080/files/Fingerpicking-f707c895-cb8f-4c36-9b22-c01ba32e7458.png","file":{}}},{"id":175,"topicName":"Barre Chords","contentData":{"id":175,"contentType":"FILE","fileId":61,"quiz":null,"file_url":"http://localhost:8080/files/Barre Chords-31ee751a-5d76-4ea2-9a67-8e387cf39c12.png","file":{}}},{"id":176,"topicName":"Playing Rhythm","contentData":{"id":176,"contentType":"FILE","fileId":62,"quiz":null,"file_url":"http://localhost:8080/files/Playing Rhythm-917aaa2d-b8cf-4e42-b021-4a9a6594b398.png","file":{}}},{"id":177,"topicName":"Introduction to Lead Guitar","contentData":{"id":177,"contentType":"FILE","fileId":63,"quiz":null,"file_url":"http://localhost:8080/files/Introduction to Lead Guitar-830fe65d-e4f5-4ef6-ada2-f7cb33e6d624.png","file":{}}}]},{"id":61,"moduleName":"Module 4: Music Theory for Guitarists","courseTopics":[{"id":178,"topicName":"Understanding Scales and Modes","contentData":{"id":178,"contentType":"FILE","fileId":64,"quiz":null,"file_url":"http://localhost:8080/files/Understanding Scales and Modes-98fde38b-525e-408b-b39e-35044a52f710.png","file":{}}},{"id":179,"topicName":"Chord Construction","contentData":{"id":179,"contentType":"FILE","fileId":65,"quiz":null,"file_url":"http://localhost:8080/files/Chord Construction-2b4a6ec4-c6d6-4049-9a28-99a3497d881a.png","file":{}}},{"id":180,"topicName":"Transposing Songs","contentData":{"id":180,"contentType":"FILE","fileId":66,"quiz":null,"file_url":"http://localhost:8080/files/Transposing Songs-85772802-bc8b-4b9b-9adb-6d1f404eb095.png","file":{}}}]},{"id":62,"moduleName":"Module 5: Advanced Techniques","courseTopics":[{"id":181,"topicName":"Guitar Soloing","contentData":{"id":181,"contentType":"FILE","fileId":67,"quiz":null,"file_url":"http://localhost:8080/files/Guitar Soloing-6f8bef14-dbd7-45b4-ac9e-2e69c9663b3b.png","file":{}}},{"id":182,"topicName":"Improvisation","contentData":{"id":182,"contentType":"FILE","fileId":68,"quiz":null,"file_url":"http://localhost:8080/files/Improvisation-c619a94e-e62c-4f79-8d87-9c5d3e2d58c8.png","file":{}}},{"id":183,"topicName":"Advanced Chord Progressions","contentData":{"id":183,"contentType":"FILE","fileId":69,"quiz":null,"file_url":"http://localhost:8080/files/Advanced Chord Progressions-b92d2e78-bc1a-4226-bf21-8f0e108138f3.png","file":{}}},{"id":184,"topicName":"Harmonics","contentData":{"id":184,"contentType":"FILE","fileId":70,"quiz":null,"file_url":"http://localhost:8080/files/Harmonics-7e8ed69f-f6c8-477a-9142-9a0bde23cd40.png","file":{}}}]}],"requirements":["No prior musical experience required","Acoustic or electric guitar"],"whatYouWillLearn":["Identify and play the different parts of a guitar","Tune the guitar using various methods","Play common open chords and strumming patterns","Understand basic music theory for guitarists","Develop fingerpicking and barre chord techniques","Explore different guitar playing styles","Learn scales, modes, and chord construction","Apply advanced techniques such as guitar soloing and improvisation"],"tags":["guitar","beginner","fingerstyle"],"reviews":[],"creationDate":"2023-05-28T11:46:42.953+00:00","lastUpdatedDate":"2023-05-28T11:46:42.953+00:00","published":false,"video_url":"http://localhost:8080/files/Introduction to Guitar-990e30d5-96cd-4a15-a750-572371a5d942.mp4","image_url":"http://localhost:8080/files/Introduction to Guitar-1bd92b9a-7d33-42e2-b061-3a72fc34237b.png","previewImage":{},"promoVideo":{}}',
//   method: 'PUT',
//   mode: 'cors',
//   credentials: 'include',
// });

const ContentAndAuth = () => {
  const { courseId, moduleId, topicId } = useParams();
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [jwt] = useLocalStorageState('', 'jwt');
  const [course, setCourse] = useState(null);
  const [openClass, setOpenClass] = useState(false);
  const [courseVideoSrc, setCourseVideoSrc] = useState('');
  const [courseReviews, setCourseReviews] = useState(null);
  const [type, setType] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [previousTopic, setPreviousTopic] = useState(null);
  const [nextTopic, setNextTopic] = useState(null);
  const [isFirstTopic, setIsFirstTopic] = useState(false);
  const [isLastTopic, setIsLastTopic] = useState(false);
  const sidebarClass = openClass
    ? 'sidebar sidebarOpen'
    : 'sidebar sidebarClosed';
  useEffect(() => {
    //get the course info
    httpReqAsync(`/api/v1/courses/${courseId}`, 'GET', jwt).then((result) => {
      console.log('I got the course:', result);
      setCourse(result);
      if (result != null) {
        if (result.curriculum?.length) {
          let coveredTopics = 0;
          let totalTopics = 0;
          let stopCoveredTopicsCount = false;
          let nextTopicHere = null;

          if (result.curriculum?.length) {
            for (const [moduleIndex, module] of result.curriculum.entries()) {
              if (module.id == moduleId) {
                setCurrentModule(module);
              }

              for (const [index, topic] of module.courseTopics.entries()) {
                totalTopics++;

                if (topic.id == topicId) {
                  stopCoveredTopicsCount = true;
                  setType(topic.contentData?.contentType);
                  setCurrentTopic(topic);

                  if (index > 0) {
                    setPreviousTopic(module.courseTopics[index - 1]);
                  } else if (moduleIndex > 0) {
                    setPreviousTopic(
                      result.curriculum[moduleIndex - 1].courseTopics[
                        result.curriculum[moduleIndex - 1].length - 1
                      ]
                    );
                  } else {
                    setPreviousTopic(null);
                  }

                  if (index < module.courseTopics.length - 1) {
                    console.log(
                      'module.courseTopics[index + 1]',
                      module.courseTopics[index + 1]
                    );

                    setNextTopic(module.courseTopics[index + 1]);
                  } else if (moduleIndex == result.curriculum.length - 1) {
                    setNextTopic(null);
                    console.log('moduleIndex == result.curriculum.length-1');
                  } else {
                    console.log(
                      'result.curriculum[moduleIndex + 1].courseTopics[0]',
                      result.curriculum[moduleIndex + 1].courseTopics[0]
                    );
                    setNextTopic(
                      result.curriculum[moduleIndex + 1].courseTopics[0]
                    );
                  }
                }

                if (!stopCoveredTopicsCount) {
                  coveredTopics++;
                }
              }

              // if (moduleIndex < result.curriculum.length - 1) {
              //     nextTopic = result.curriculum[moduleIndex + 1].courseTopics[0];
              // }
            }

            const firstTopicId = result.curriculum[0]?.courseTopics[0]?.id;
            const lastTopicId =
              result.curriculum[result.curriculum.length - 1]?.courseTopics[
                result.curriculum[result.curriculum.length - 1]?.courseTopics
                  .length - 1
              ]?.id;

            setIsFirstTopic(topicId === firstTopicId);
            setIsLastTopic(topicId === lastTopicId);

            setPercentage(((coveredTopics * 100) / totalTopics).toFixed(0));
          }

          setPercentage(((coveredTopics * 100) / totalTopics).toFixed(0));
        }
      }
    });
  }, [jwt, courseId, moduleId, topicId]);

  // useEffect(() => {
  //     //get the course info
  //     console.log("prev Module:", previousTopic);
  //     console.log("next Topic:", nextTopic);

  // }, [previousTopic, nextTopic]);
  return (
    <div>
      <div id="wrapper" className="course-watch">
        {/* sidebar */}
        <div className={sidebarClass}>
          {/* slide_menu for mobile */}
          <span
            onClick={() => setOpenClass(!openClass)}
            className="btn-close-mobi right-3 left-auto"
            uk-toggle="target: #wrapper ; cls: is-active"
          />
          {/* back to home link */}
          <div className="flex justify-between lg:-ml-1 mt-1 mr-2">
            <Link to="/dashboard" className="flex items-center text-blue-500">
              <ion-icon
                name="chevron-back-outline"
                className="md:text-lg text-2xl md hydrated"
                role="img"
                aria-label="chevron back outline"
              />
              <span className="text-sm md:inline hidden"> Dashboard</span>
            </Link>
          </div>
          {/* title */}
          <h1 className="lg:text-2xl text-lg font-bold mt-2 line-clamp-2">
            {course?.courseName}
          </h1>
          {/* sidebar list */}
          <div className="sidebar_inner is-watch-2" data-simplebar="init">
            <div className="simplebar-wrapper" style={{ margin: '-15px' }}>
              <div className="simplebar-height-auto-observer-wrapper">
                <div className="simplebar-height-auto-observer" />
              </div>
              <div className="simplebar-mask">
                <div
                  className="simplebar-offset"
                  style={{ right: '-15px', bottom: 0 }}
                >
                  <div
                    className="simplebar-content"
                    style={{
                      padding: 15,
                      height: '100%',
                      overflow: 'hidden scroll',
                    }}
                  >
                    <div className="lg:inline hidden">
                      <div className="relative overflow-hidden rounded-md bg-gray-200 h-1 mt-4">
                        <div
                          className=" h-full bg-green-500"
                          style={{ width: percentage + '%' }}
                        />
                      </div>
                      <div className="mt-2 mb-3 text-sm border-b pb-3">
                        <div> {percentage}% Complete</div>
                        <div>
                          {' '}
                          Last updated on{' '}
                          {course?.lastUpdatedDate
                            ? new Date(course.lastUpdatedDate).toLocaleString()
                            : 'No shown'}
                        </div>
                      </div>
                    </div>
                    <div id="curriculum">
                      <div
                        uk-accordion="multiple: true"
                        className="divide-y space-y-3 uk-accordion"
                      >
                        {course?.curriculum?.map((module, index) => (
                          <div className="uk-open">
                            <a
                              className="uk-accordion-title text-md mx-2 font-semibold"
                              href="#"
                            >
                              <div className="mb-1 text-sm font-medium">
                                Module {index + 1}
                              </div>
                              {module.moduleName}
                            </a>
                            <div
                              className="uk-accordion-content mt-3"
                              aria-hidden="false"
                            >
                              <ul
                                className="course-curriculum-list"
                                uk-switcher="connect: #video_tabs; animation: animation: uk-animation-slide-right-small, uk-animation-slide-left-medium"
                              >
                                {module.courseTopics.map((topic) => (
                                  <li
                                    key={topic.id}
                                    className={
                                      topic.id == topicId ? 'uk-active' : ''
                                    }
                                  >
                                    <Link
                                      className={
                                        'type_' + topic.contentData?.contentType
                                      }
                                      to={`/courses/content/${courseId}/${module.id}/${topic.id}`}
                                      aria-expanded="true"
                                    >
                                      {topic.topicName}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="simplebar-placeholder"
                style={{ width: 359, height: 1121 }}
              />
            </div>
            <div
              className="simplebar-track simplebar-horizontal"
              style={{ visibility: 'hidden' }}
            >
              <div
                className="simplebar-scrollbar"
                style={{
                  transform: 'translate3d(0px, 0px, 0px)',
                  visibility: 'hidden',
                }}
              />
            </div>
            <div
              className="simplebar-track simplebar-vertical"
              style={{ visibility: 'visible' }}
            >
              <div
                className="simplebar-scrollbar"
                style={{
                  height: 60,
                  transform: 'translate3d(0px, 112px, 0px)',
                  visibility: 'visible',
                }}
              />
            </div>
          </div>
          {/* overly for mobile */}
          <div
            className="side_overly"
            uk-toggle="target: #wrapper ; cls: is-collapse is-active"
          />
        </div>
        {/* Main Contents */}
        <div className="main_content">
          {currentTopic?.contentData?.contentType == 'VIDEO' && (
            <div className="relative container">
              <ul
                className="uk-switcher relative z-10"
                id="video_tabs"
                style={{ touchAction: 'pan-y pinch-zoom' }}
              >
                <li className="uk-active">
                  {/* to autoplay video uk-video="automute: true" */}
                  <div className="">
                    <VideoPlayer
                      videoSrc={currentTopic?.contentData?.file_url}
                    />
                  </div>
                </li>
              </ul>
              <div className="bg-gray-200 w-full h-full absolute inset-0 animate-pulse" />
            </div>
          )}
          {currentTopic?.contentData?.contentType == 'IMAGE' && (
            <div className="relative container">
              <ul
                className="uk-switcher relative z-10"
                id="video_tabs"
                style={{ touchAction: 'pan-y pinch-zoom' }}
              >
                <li className="uk-active">
                  {/* to autoplay video uk-video="automute: true" */}
                  <div className="">
                    <img
                      src={currentTopic?.contentData?.file_url}
                      className="w-full"
                      alt=""
                    />
                  </div>
                </li>
              </ul>
            </div>
          )}

          <div className="container">
            <div
              className="max-w-2xl mx-auto "
              id="course-tabs"
              style={{ touchAction: 'pan-y pinch-zoom', margin: 'auto' }}
            >
              {/*  Overview */}
              <div className="uk-active  " style={{}}>
                <h4 className="text-2xl font-semibold text-center">
                  {' '}
                  {currentTopic?.topicName}{' '}
                </h4>

                {currentTopic?.contentData?.contentType == 'TEXT' && (
                  <div className="relative ">
                    <div
                      className="card  p-6"
                      dangerouslySetInnerHTML={{
                        __html: currentTopic?.contentData?.text,
                      }}
                    ></div>
                  </div>
                )}

                {currentTopic?.contentData?.contentType == 'DOC' && (
                  <div className="relative ">
                    <div className="card  p-6">
                      <a href={currentTopic?.contentData?.file_url}>
                        {currentTopic?.contentData?.file_url}
                      </a>
                    </div>
                  </div>
                )}
                {currentTopic?.contentData?.contentType == 'QUIZ' && (
                  <div className="relative ">
                    <div className="card  p-6">
                      <Exam quizData={currentTopic?.contentData?.quiz} />
                    </div>
                  </div>
                )}

                <div className="navss flex md:gap-6 gap-3 md:mt-10 mt-5 text-center flex justify-center">
                  {previousTopic && (
                    <Link
                      to={`/courses/content/${courseId}/${moduleId}/${nextTopic?.id}`}
                      className="bg-gray-200 w-1/2 flex font-medium items-center justify-center py-3 rounded-md"
                    >
                      <ion-icon name="arrow-back-outline"></ion-icon>
                      <span className="block">
                        Back to <b>{previousTopic?.topicName}</b>
                      </span>
                    </Link>
                  )}
                  {nextTopic ? (
                    <Link
                      to={`/courses/content/${courseId}/${moduleId}/${nextTopic?.id}`}
                      className="bg-blue-600 w-1/2 text-white flex font-medium items-center justify-center py-3 rounded-md hover:text-white"
                    >
                      <span className="block">
                        {' '}
                        Next to <b>{nextTopic?.topicName}</b>{' '}
                      </span>
                      <ion-icon name="arrow-forward-outline"></ion-icon>
                    </Link>
                  ) : (
                    <Link
                      to={`/courses/finish/${courseId}`}
                      className="bg-blue-600 w-1/2 text-white flex font-medium items-center justify-center py-3 rounded-md hover:text-white"
                    >
                      <span className="block"> Complete Course </span>
                      <ion-icon name="arrow-forward-outline"></ion-icon>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* This is the modal */}
      </div>
    </div>
  );
};
export default ContentAndAuth;
