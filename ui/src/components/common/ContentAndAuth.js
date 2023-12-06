import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import VideoPlayer from './VideoPlayer';
import Exam from './Quiz';

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
  const [nextAllowed, setNextAllowed] = useState(true);

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
                  if (topic.contentData?.contentType === 'QUIZ') {
                    setNextAllowed(false);
                  }

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
                      <Exam
                        quizData={currentTopic?.contentData?.quiz}
                        nextAllowed={setNextAllowed}
                      />
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
                  {nextAllowed && (
                    <>
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
                    </>
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
