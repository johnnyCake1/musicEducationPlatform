
import React, { useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import VideoPlayer from './VideoPlayer';

const ContentAndAuth = () => {
    const { courseId,moduleId, topicId } = useParams();
    const [currentUser] = useLocalStorageState(null, "currentUser");
    const [jwt] = useLocalStorageState("", "jwt");
    const [course, setCourse] = useState(null);
    const [courseVideoSrc, setCourseVideoSrc] = useState("");
    const [courseReviews, setCourseReviews] = useState(null);
    const [type, setType] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [percentage, setPercentage] = useState(0);
    const [previousTopic, setPreviousTopic] = useState(null);
    const [nextTopic, setNextTopic] = useState(null);
    const [isFirstTopic, setIsFirstTopic] = useState(false);
    const [isLastTopic, setIsLastTopic] = useState(false);
    useEffect(() => {
        //get the course info
        httpReqAsync(`/api/v1/courses/${courseId}`, "GET", jwt).then((result) => {
            console.log("I got the course:", result);
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
                                        setPreviousTopic(result.curriculum[moduleIndex - 1].courseTopics[result.curriculum[moduleIndex - 1].length - 1]);
                                    } else {
                                        setPreviousTopic(null);
                                    }

                                    if (index < module.courseTopics.length - 1) {
                                        console.log('module.courseTopics[index + 1]', module.courseTopics[index + 1])

                                        setNextTopic(module.courseTopics[index + 1]);
                                    } else if (moduleIndex == result.curriculum.length-1) {
                                        setNextTopic(null);
                                        console.log("moduleIndex == result.curriculum.length-1")
                                    } else {
                                        console.log('result.curriculum[moduleIndex + 1].courseTopics[0]', result.curriculum[moduleIndex + 1].courseTopics[0])
                                        setNextTopic(result.curriculum[moduleIndex + 1].courseTopics[0]);
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
                                result.curriculum[result.curriculum.length - 1]?.courseTopics.length - 1
                            ]?.id;

                        setIsFirstTopic(topicId === firstTopicId);
                        setIsLastTopic(topicId === lastTopicId);

                        setPercentage((coveredTopics * 100) / totalTopics);
                    }

                    setPercentage((coveredTopics * 100) / totalTopics);
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
                <div className="sidebar">
                    {/* slide_menu for mobile */}
                    <span
                        className="btn-close-mobi right-3 left-auto"
                        uk-toggle="target: #wrapper ; cls: is-active"
                    />
                    {/* back to home link */}
                    <div className="flex justify-between lg:-ml-1 mt-1 mr-2">
                        <a href="course-intro.html" className="flex items-center text-blue-500">
                            <ion-icon
                                name="chevron-back-outline"
                                className="md:text-lg text-2xl md hydrated"
                                role="img"
                                aria-label="chevron back outline"
                            />
                            <span className="text-sm md:inline hidden"> back</span>
                        </a>
                    </div>
                    {/* title */}
                    <h1 className="lg:text-2xl text-lg font-bold mt-2 line-clamp-2">
                        {course?.courseName}
                    </h1>
                    {/* sidebar list */}
                    <div className="sidebar_inner is-watch-2" data-simplebar="init">
                        <div className="simplebar-wrapper" style={{ margin: "-15px" }}>
                            <div className="simplebar-height-auto-observer-wrapper">
                                <div className="simplebar-height-auto-observer" />
                            </div>
                            <div className="simplebar-mask">
                                <div
                                    className="simplebar-offset"
                                    style={{ right: "-15px", bottom: 0 }}
                                >
                                    <div
                                        className="simplebar-content"
                                        style={{ padding: 15, height: "100%", overflow: "hidden scroll" }}
                                    >
                                        <div className="lg:inline hidden">
                                            <div className="relative overflow-hidden rounded-md bg-gray-200 h-1 mt-4">
                                                <div className=" h-full bg-green-500" style={{width:percentage+"%"}} />
                                            </div>
                                            <div className="mt-2 mb-3 text-sm border-b pb-3">
                                                <div> {percentage}% Complete</div>
                                                <div> Last updated on {course?.lastUpdatedDate ? (new Date(course.lastUpdatedDate)).toLocaleString() : "No shown"}</div>
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
                                                            Module {index+1}
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
                                                            {module.courseTopics.map((topic)=> (
                                                                
                                                            <li className={topic.id==topicId?"uk-active":""}>
                                                                    <Link className={"type_" + topic.contentData?.contentType} to={`/courses/content/${courseId}/${module.id}/${topic.id}`} aria-expanded="true">
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
                                        <div className="mt-5">
                                            <h3 className="mb-4 text-lg font-semibold"> Quizzes</h3>
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <ion-icon
                                                            name="timer-outline"
                                                            class="side-icon md hydrated"
                                                            role="img"
                                                            aria-label="timer outline"
                                                        />
                                                        Taking small eco-friendly steps
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        
                                                        <ion-icon
                                                            name="timer-outline"
                                                            class="side-icon md hydrated"
                                                            role="img"
                                                            aria-label="timer outline"
                                                        />
                                                        Making your house eco-friendly
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        
                                                        <ion-icon
                                                            name="timer-outline"
                                                            class="side-icon md hydrated"
                                                            role="img"
                                                            aria-label="timer outline"
                                                        />
                                                        Building and renovating for eco-friendly homes
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        
                                                        <ion-icon
                                                            name="log-in-outline"
                                                            class="side-icon md hydrated"
                                                            role="img"
                                                            aria-label="log in outline"
                                                        />
                                                        Taking small eco-friendly
                                                    </a>
                                                    <ul>
                                                        <li>
                                                            <a href="#"> Making your house </a>
                                                        </li>
                                                        <li>
                                                            <a href="#"> Building and renovating </a>
                                                        </li>
                                                        <li>
                                                            <a href="#"> Taking small </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
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
                            style={{ visibility: "hidden" }}
                        >
                            <div
                                className="simplebar-scrollbar"
                                style={{
                                    transform: "translate3d(0px, 0px, 0px)",
                                    visibility: "hidden"
                                }}
                            />
                        </div>
                        <div
                            className="simplebar-track simplebar-vertical"
                            style={{ visibility: "visible" }}
                        >
                            <div
                                className="simplebar-scrollbar"
                                style={{
                                    height: 60,
                                    transform: "translate3d(0px, 112px, 0px)",
                                    visibility: "visible"
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
                    {
                        currentTopic?.contentData?.contentType=="VIDEO" &&
                        <div className="relative">
                            <ul
                                className="uk-switcher relative z-10"
                                id="video_tabs"
                                style={{ touchAction: "pan-y pinch-zoom" }}
                            >
                                <li className="uk-active">
                                    {/* to autoplay video uk-video="automute: true" */}
                                    <div className="">
                                        <VideoPlayer videoSrc={currentTopic?.contentData?.file_url} />
                                    </div>
                                </li>
                            </ul>
                            <div className="bg-gray-200 w-full h-full absolute inset-0 animate-pulse" />
                        </div>
                    }
                    {
                        currentTopic?.contentData?.contentType=="IMAGE" &&
                        <div className="relative">
                            <ul
                                className="uk-switcher relative z-10"
                                id="video_tabs"
                                style={{ touchAction: "pan-y pinch-zoom" }}
                            >
                                <li className="uk-active">
                                    {/* to autoplay video uk-video="automute: true" */}
                                    <div className="">
                                        <img src={currentTopic?.contentData?.file_url} className="w-full" alt="" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    }
                    
                    
                    <div className="container">
                        <div
                            className="max-w-2xl mx-auto uk-switcher"
                            id="course-tabs"
                            style={{ touchAction: "pan-y pinch-zoom" }}
                        >
                            {/*  Overview */}
                            <div className="uk-active  " style={{}}>
                                <h4 className="text-2xl font-semibold text-center"> {course?.courseName} </h4>

                                <div className="flex md:gap-6 gap-3 md:mt-10 mt-5 text-center flex justify-center">
                                    
                                    {previousTopic && <Link
                                        to={`/courses/content/${courseId}/${moduleId}/${nextTopic?.id}`}
                                        className="bg-gray-200 w-1/2 flex font-medium items-center justify-center py-3 rounded-md"
                                        
                                    >
                                        <ion-icon name="arrow-back-outline"></ion-icon>
                                        <span className="block">Back to <b>{previousTopic?.topicName}</b></span>
                                    </Link>
                                    }
                                    {
                                    nextTopic?
                                    
                                    <Link
                                        to={`/courses/content/${courseId}/${moduleId}/${nextTopic?.id}`}
                                        className="bg-blue-600 w-1/2 text-white flex font-medium items-center justify-center py-3 rounded-md hover:text-white"
                                        
                                    >
                                        <span className="block"> Next to <b>{nextTopic?.topicName}</b> </span>
                                        <ion-icon name="arrow-forward-outline"></ion-icon>

                                    </Link>
                                    :
                                    <Link
                                        to={`/courses/finish/${courseId}`}
                                        className="bg-blue-600 w-1/2 text-white flex font-medium items-center justify-center py-3 rounded-md hover:text-white"
                                        
                                    >
                                        <span className="block"> Complete Course </span>
                                        <ion-icon name="arrow-forward-outline"></ion-icon>

                                    </Link>
                                    }
                                </div>
                            </div>
                            {/*  Announcements */}
                            <div className="" style={{}}>
                                <h3 className="text-xl font-semibold mb-3"> Announcement </h3>
                                <div className="flex items-center gap-x-4 mb-5">
                                    <img
                                        src="../assets/images/avatars/avatar-4.jpg"
                                        alt=""
                                        className="rounded-full shadow w-12 h-12"
                                    />
                                    <div>
                                        <h4 className="-mb-1 text-base"> Stella Johnson</h4>
                                        <span className="text-sm">
                                            
                                            Instructor <span className="text-gray-500">
                                                
                                                1 year ago
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <h4 className="leading-8 text-xl">
                                    
                                    Nam liber tempor cum soluta nobis eleifend option congue imperdiet
                                    doming id quod mazim placerat facer possim assum.
                                </h4>
                                <p>
                                    
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                    culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <p>
                                    
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
                                    nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
                                    volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
                                    consequat. Nam liber tempor cum soluta nobis eleifend option congue
                                    nihil imperdiet doming id quod mazim placerat facer possim assum.
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
                                    nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
                                    volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
                                    consequat.
                                </p>
                            </div>
                            {/* faq */}
                            <div className="" style={{}}>
                                <h3 className="text-xl font-semibold mb-3"> Course Faq </h3>
                                <ul
                                    uk-accordion="multiple: true"
                                    className="divide-y space-y-3 space-y-6 uk-accordion"
                                >
                                    <li className="uk-open">
                                        <a
                                            className="uk-accordion-title font-semibold text-xl mt-4"
                                            href="#"
                                        >
                                            
                                            Html Introduction
                                        </a>
                                        <div className="uk-accordion-content mt-3" aria-hidden="false">
                                            <p>
                                                
                                                The primary goal of this quick start guide is to introduce you
                                                to Unreal Engine 4`s (UE4) development environment. By the end
                                                of this guide, you`ll know how to set up and develop C++
                                                Projects in UE4. This guide shows you how to create a new
                                                Unreal Engine project, add a new C++ class to it, compile the
                                                project, and add an instance of a new class to your level. By
                                                the time you reach the end of this guide, you`ll be able to
                                                see your programmed Actor floating above a table in the level.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <a
                                            className="uk-accordion-title font-semibold text-xl mt-4"
                                            href="#"
                                        >
                                            
                                            Your First webpage
                                        </a>
                                        <div
                                            className="uk-accordion-content mt-3"
                                            hidden=""
                                            aria-hidden="true"
                                        >
                                            <p>
                                                
                                                The primary goal of this quick start guide is to introduce you
                                                to Unreal Engine 4`s (UE4) development environment. By the end
                                                of this guide, you`ll know how to set up and develop C++
                                                Projects in UE4. This guide shows you how to create a new
                                                Unreal Engine project, add a new C++ class to it, compile the
                                                project, and add an instance of a new class to your level. By
                                                the time you reach the end of this guide, you`ll be able to
                                                see your programmed Actor floating above a table in the level.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <a
                                            className="uk-accordion-title font-semibold text-xl mt-4"
                                            href="#"
                                        >
                                            
                                            Some Special Tags
                                        </a>
                                        <div
                                            className="uk-accordion-content mt-3"
                                            hidden=""
                                            aria-hidden="true"
                                        >
                                            <p>
                                                
                                                The primary goal of this quick start guide is to introduce you
                                                to Unreal Engine 4`s (UE4) development environment. By the end
                                                of this guide, you`ll know how to set up and develop C++
                                                Projects in UE4. This guide shows you how to create a new
                                                Unreal Engine project, add a new C++ class to it, compile the
                                                project, and add an instance of a new class to your level. By
                                                the time you reach the end of this guide, you`ll be able to
                                                see your programmed Actor floating above a table in the level.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <a
                                            className="uk-accordion-title font-semibold text-xl mt-4"
                                            href="#"
                                        >
                                            
                                            Html Introduction
                                        </a>
                                        <div
                                            className="uk-accordion-content mt-3"
                                            hidden=""
                                            aria-hidden="true"
                                        >
                                            <p>
                                                
                                                The primary goal of this quick start guide is to introduce you
                                                to Unreal Engine 4`s (UE4) development environment. By the end
                                                of this guide, you`ll know how to set up and develop C++
                                                Projects in UE4. This guide shows you how to create a new
                                                Unreal Engine project, add a new C++ class to it, compile the
                                                project, and add an instance of a new class to your level. By
                                                the time you reach the end of this guide, you`ll be able to
                                                see your programmed Actor floating above a table in the level.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* This is the modal */}
            </div>


        </div>
    );
}
export default ContentAndAuth;