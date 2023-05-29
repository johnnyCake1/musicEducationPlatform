import React, { useEffect, useState } from "react";
import "./CourseCreationPage.css";
import { FaBook, FaCheck } from "react-icons/fa";
import useLocalStorageState from "../../util/useLocalStorageState";
import { useNavigate, useParams } from "react-router-dom";
import { getFile, httpReqAsync } from "../../services/httpReqAsync";
import VideoPlayer from "../common/VideoPlayer";
import { ReactSortable } from "react-sortablejs";
import QuizCreator from './QuizCreatiion'
const CourseCreationPage = () => {
  const { courseId } = useParams();
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [courseData, setCourseData] = useState({
    id: courseId,
    authorId: currentUser.id,
    courseName: "",
    price: 0,
    courseShortDescription: "",
    courseLongDescription: "",
    requirements: [],
    whatYouWillLearn: [],
    curriculum: [],
    tags: [],
    previewImage: null,
    promoVideo: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async (curriculum) => {
      const updatedCurriculum = await Promise.all(
        curriculum.map(async (module) => {
          const updatedTopics = await Promise.all(
            module.courseTopics.map(async (topic) => {
              if (
                topic.contentData.contentType === "FILE" &&
                topic.contentData.fileId
              ) {
                const fileData = await getFile(
                  `/api/v1/files/${topic.contentData.fileId}`,
                  jwt
                );
                if (fileData && fileData instanceof Blob) {
                  const updatedContentData = {
                    ...topic.contentData,
                    file: fileData,
                  };
                  return {
                    ...topic,
                    contentData: updatedContentData,
                  };
                }
              }
              return topic;
            })
          );
          return {
            ...module,
            courseTopics: updatedTopics,
          };
        })
      );
      setCourseData((prevCourseData) => ({
        ...prevCourseData,
        curriculum: updatedCurriculum,
      }));
    };

    //fetch the course data
    httpReqAsync(`/api/v1/courses/${courseId}`, "GET", jwt).then((result) => {
      // if (
      //   String(currentUser.id) !== String(result.authorId) ||
      //   result.published
      // ) {
      //   console.log(
      //     "This user cannot access this page or the course was not a draft"
      //   );
      //   // navigate("/my-courses");
      //   setError(
      //     "This user cannot access this page or the course was not a draft"
      //   );
      //   return;
      // }

      //fill out the data
      setCourseData(result);
      console.log("the result:", result);
      //fetch course preview image and append it to course data
      if (result.previewImageId) {
        getFile(`/api/v1/files/${result.previewImageId}`, jwt).then(
          (blobPicture) => {
            if (blobPicture && blobPicture instanceof Blob) {
              setCourseData((prevCourseData) => ({
                ...prevCourseData,
                previewImage: blobPicture,
              }));
            }
          }
        );
      }
      //fetch course promo video and append it to course data
      if (result.promoVideoId) {
        getFile(`/api/v1/files/${result.promoVideoId}`, jwt).then(
          (blobVideo) => {
            if (blobVideo && blobVideo instanceof Blob) {
              setCourseData((prevCourseData) => ({
                ...prevCourseData,
                promoVideo: blobVideo,
              }));
            }
          }
        );
      }
      //fetch course topics
      fetchFiles(result.curriculum);
    });
  }, [jwt, courseId, currentUser, toggleRefresh]);

  console.log("courseData:", courseData);

  if (error || !courseData) {
    return <div>{`Error: ${error}`}</div>;
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    console.log("sas", name, value);

    if (name === "price") {
      // Remove non-digit characters
      value = value.replace(/[^0-9.]/g, "");

      // Add decimal places
      value = parseFloat(value).toFixed(2);
      console.log("sas2", name, value);
    }
    setCourseData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRequirementsChange = (e, index) => {
    const { value } = e.target;
    setCourseData((prevState) => {
      const requirements = [...prevState.requirements];
      requirements[index] = value;
      return { ...prevState, requirements };
    });
  };

  const handleWhatYouWillLearnChange = (e, index) => {
    const { value } = e.target;
    setCourseData((prevState) => {
      const whatYouWillLearn = [...prevState.whatYouWillLearn];
      whatYouWillLearn[index] = value;
      return { ...prevState, whatYouWillLearn };
    });
  };

  const handleCurriculumChange = (e, moduleIndex, topicIndex) => {
    const { name, value, type, files } = e.target;
    console.log('log', value)
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.contentType = value;

      const newCourseData = { ...prevState, curriculum };
      return newCourseData;
    });
  };
  const handleTopicNameChange = (e, moduleIndex, topicIndex) => {
    const { name, value, type, files } = e.target;
    
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics[topicIndex][name] = value;

      const newCourseData = { ...prevState, curriculum };
      return newCourseData;
    });
  };
  const handleTextChange = (e, moduleIndex, topicIndex) => {
    const { name, value, type, files } = e.target;

    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.text = value;
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.contentType = "TEXT";

      const newCourseData = { ...prevState, curriculum };
      return newCourseData;
    });
  };
  
  const handleQuizUpdate = (data, moduleIndex, topicIndex) => {
    // console.log('sdfds', data)
    const updatedQuestions = data.map(({ id, ...rest }) => rest);

    // console.log("sdfsdfsdfsd", curriculum[moduleIndex].courseTopics[topicIndex].contentData)
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      console.log("sdfsdf",curriculum[moduleIndex].courseTopics[topicIndex].contentData)
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.quiz = updatedQuestions;
      const newCourseData = { ...prevState, curriculum };
      return newCourseData;
    });
  };

  const handleUpload = (e, moduleIndex, topicIndex) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      console.log("state of course data before sending file:", courseData);
      httpReqAsync("/api/v1/files", "POST", jwt, files[0]).then((result) => {
        console.log("state of course data after sending file:", courseData);
        setCourseData((prevState) => {
          const curriculum = [...prevState.curriculum];
          curriculum[moduleIndex].courseTopics[topicIndex].contentData = {
            img_url: result.filePath,
            fileId: result.id,
          };
          return { ...prevState, curriculum };
        });
      });

      return;
    }
  };

  const handleTagChange = (e, index) => {
    const { value } = e.target;
    setCourseData((prevState) => {
      const tags = [...prevState.tags];
      tags[index] = value;
      return {
        ...prevState,
        tags,
      };
    });
  };

  const handleRemoveRequirement = (index) => {
    setCourseData((prevState) => {
      const requirements = [...prevState.requirements];
      requirements.splice(index, 1);
      return { ...prevState, requirements };
    });
  };

  const handleRemoveWhatYouWillLearn = (index) => {
    setCourseData((prevState) => {
      const whatYouWillLearn = [...prevState.whatYouWillLearn];
      whatYouWillLearn.splice(index, 1);
      return { ...prevState, whatYouWillLearn };
    });
  };

  const handleRemoveModule = (moduleIndex) => {
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum.splice(moduleIndex, 1);
      return { ...prevState, curriculum };
    });
  };

  const handleRemoveTopic = (moduleIndex, topicIndex) => {
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics.splice(topicIndex, 1);
      return { ...prevState, curriculum };
    });
  };

  const handleRemoveTag = (index) => {
    setCourseData((prevState) => {
      const tags = [...prevState.tags];
      tags.splice(index, 1);
      return { ...prevState, tags };
    });
  };

  const handlePreviewPictureChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    httpReqAsync("/api/v1/files", "POST", jwt, file).then((result) => {
      console.log('hello', result)
      setCourseData((prevState) => ({
        ...prevState,
        img_url: URL.createObjectURL(file),
        previewImageId: result,
      }));
    });
  };

  const handlePromoVideoChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    httpReqAsync("/api/v1/files", "POST", jwt, file).then((result) => {
      setCourseData((prevState) => ({
        ...prevState,
        promoVideo: file,
        promoVideoId: result,
      }));
    });
  };

  const handlePublishCourse = (e) => {
    e.preventDefault();
    console.log("final data sent:", courseData);
    courseData.published = true;
    httpReqAsync(`/api/v1/courses`, "PUT", jwt, courseData).then((result) => {
      console.log("saved:", result);
      navigate(`/courses/${courseId}/description`);
    });
  };

  const handleSaveAsDraft = (e) => {
    e.preventDefault();
    courseData.published = false;
    httpReqAsync(`/api/v1/courses`, "PUT", jwt, courseData).then((result) => {
      console.log("saved:", result);
      setCourseData(result);
      // setToggleRefresh(!toggleRefresh);
    });
  };

  const handleDeleteCourse = (e) => {
    e.preventDefault();
    httpReqAsync(`/api/v1/courses/${courseData.id}`, "DELETE", jwt, courseData);
    navigate(`/my-courses`);
  };

  const handleRequirementsSort = (newOrder) => {
    console.log("newOrder", newOrder)
    const newRequirements = newOrder.map((index) => courseData.requirements[index]);
    setCourseData((prevState) => ({
      ...prevState,
      requirements: newRequirements,
    }));
  };
  return (
    <div className="course-creation-page">
      <h1>Create a Course</h1>
      <form>
        <div>
          <label htmlFor="courseName">
            Course Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={courseData.courseName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="price">Course price($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={courseData.price}
            step="0.1"
            min="0"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="courseShortDescription">Short Description:</label>
          <textarea
            id="courseShortDescription"
            name="courseShortDescription"
            value={courseData.courseShortDescription}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="courseLongDescription">Long Description:</label>
          <textarea
            id="courseLongDescription"
            name="courseLongDescription"
            value={courseData.courseLongDescription}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="requirements">Requirements:</label>
          <ReactSortable
            className="sortable-list"
            animation="200"
            easing="ease-out"
            list={courseData.requirements}
            setList={(newState) => {
              setCourseData((prevState) => ({
                ...prevState,
                requirements: newState,
              }));
            }}
          >
            {courseData.requirements.map((requirement, index) => (
              <div key={index} className="item">
                <ion-icon name="list-outline" style={{fontSize:20, cursor:'move'}}></ion-icon> &nbsp;
                <FaBook className="what-youll-learn__tick" />

                <input
                  type="text"
                  key={index}
                  value={requirement}
                  onChange={(e) => handleRequirementsChange(e, index)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="remove-button remove_button"
                >
                  Remove
                </button>
              </div>
            ))}
          </ReactSortable>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() =>
              setCourseData((prevState) => ({
                ...prevState,
                requirements: [...prevState.requirements, ""],
              }))
            }
          >
            Add Requirement
          </button>
          <hr />
        </div>

        

        <div>
          <label htmlFor="whatYouWillLearn">What You Will Learn:</label>
          <ReactSortable
            className="sortable-list"
            animation="200"
            easing="ease-out"
            list={courseData.whatYouWillLearn}
            setList={(newState) => {
              setCourseData((prevState) => ({
                ...prevState,
                whatYouWillLearn: newState,
              }));
            }}
          >
            {courseData.whatYouWillLearn.map((item, index) => (
              <div key={index} className="item">
                <ion-icon name="list-outline" style={{ fontSize: 20, cursor: 'move' }}></ion-icon> &nbsp;

                <FaCheck className="what-youll-learn__tick" />
                <span>
                  <input
                    type="text"
                    key={index}
                    value={item}
                    onChange={(e) => handleWhatYouWillLearnChange(e, index)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveWhatYouWillLearn(index)}
                    className="remove-button remove_button"
                  >
                    Remove
                  </button>
                </span>
              </div>
            ))}
          </ReactSortable>
          
          
          <button
            type="button"
            onClick={() =>
              setCourseData((prevState) => ({
                ...prevState,
                whatYouWillLearn: [...prevState.whatYouWillLearn, ""],
              }))
            }
          >
            Add Item
          </button>
          <hr />
        </div>

        <div>
          <label htmlFor="curriculum">Curriculum:</label>
          {courseData.curriculum.map((module, moduleIndex) => (
            <div className="module-item" key={moduleIndex}>
              <label htmlFor={`module-${moduleIndex}`}>Module Name:</label>
              <input
                type="text"
                id={`module-${moduleIndex}`}
                value={module.moduleName}
                onChange={(e) =>
                  setCourseData((prevState) => {
                    const curriculum = [...prevState.curriculum];
                    curriculum[moduleIndex].moduleName = e.target.value;
                    return { ...prevState, curriculum };
                  })
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveModule(moduleIndex)}
                className="remove-button remove_button"
              >
                Remove Module
              </button>
              <ReactSortable
                className="sortable-list"
                animation="200"
                easing="ease-out"
                list={module.courseTopics}
                setList={(newState) => {
                  setCourseData((prevState) => {
                    const updatedModule = { ...prevState.curriculum[moduleIndex] };
                    updatedModule.courseTopics = newState;

                    const updatedCurriculum = [...prevState.curriculum];
                    updatedCurriculum[moduleIndex] = updatedModule;

                    return {
                      ...prevState,
                      curriculum: updatedCurriculum,
                    };
                  });
                }}
              >
                {module.courseTopics.map((topic, topicIndex) => (

                  <div className="topic-item" key={topicIndex}>
                    <ion-icon name="list-outline" style={{ fontSize: 20, cursor: 'move' }}></ion-icon> &nbsp;
                    <label htmlFor={`topic-${moduleIndex}-${topicIndex}`}>
                      Topic Name:
                    </label>
                    <input
                      type="text"
                      id={`topic-${moduleIndex}-${topicIndex}`}
                      value={topic.topicName}
                      onChange={(e) =>
                        handleTopicNameChange(e, moduleIndex, topicIndex)
                      }
                      name="topicName"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(moduleIndex, topicIndex)}
                      className="remove-button remove_button"
                    >
                      Remove topic
                    </button>
                    <select
                      defaultValue="VIDEO"
                      value={topic.contentData.contentType}
                      onChange={(e) =>
                        handleCurriculumChange(e, moduleIndex, topicIndex)
                      }
                      name="contentType"
                    >
                      <option value="VIDEO">VIDEO</option>
                      <option value="IMAGE">IMAGE</option>
                      <option value="DOC">DOC</option>
                      <option value="TEXT">TEXT</option>
                      <option value="QUIZ">QUIZ</option>

                      {/* Add more content type options */}
                    </select>
                      <>
                        <>
                          {topic.contentData.contentType == "IMAGE" && (
                            <>
                            <img
                              src={topic.img_url ? topic.img_url : "https://uploader-assets.s3.ap-south-1.amazonaws.com/codepen-default-placeholder.png"}
                              alt="topic"
                              style={{ maxWidth: "300px" }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleUpload(e, moduleIndex, topicIndex)
                              }
                              name="contentData"
                            />
                            </>
                          )}
                          {topic.contentData.contentType == "VIDEO" && (
                            <>
                            <VideoPlayer
                              videoSrc={topic.video_url}
                            /><input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleUpload(e, moduleIndex, topicIndex)
                              }
                              name="contentData"
                            />
                            </>
                            
                          )}
                          {topic.contentData.contentType == "DOC" && (
                            <>
                            <iframe src={topic.file_url} title="title">
                              Presss me: <a href="./resources/crayola.pdf">Download PDF</a>
                            </iframe>
                            <input
                              type="file"
                              accept=".pdf, .doc, .docx, .xls, .xlsx"
                              onChange={(e) =>
                                handleUpload(e, moduleIndex, topicIndex)
                              }
                              name="contentData"
                            />
                            </>
                            
                          )}

                        
                        </>
                      
                      {topic.contentData.contentType == "IMAGE" || topic.contentData.contentType == "VIDEO" || topic.contentData.contentType == "DOC" || topic.contentData.contentType == "FILE" && (
                        <input
                          type="file"
                          onChange={(e) =>
                            handleUpload(e, moduleIndex, topicIndex)
                          }
                          name="contentData"
                        />
                        )}
                      {topic.contentData.contentType == "QUIZ" && (
                        <>
                          <QuizCreator handleQuizUpdate={handleQuizUpdate} topicIndex={topicIndex} moduleIndex={moduleIndex} quizData={topic.contentData.quiz} />
                        </>

                      )}
                      {topic.contentData.contentType == "TEXT" && (
                        <>
                          <textarea
                            onChange={(e) =>
                              handleTextChange(e, moduleIndex, topicIndex)
                            } id="about" name="about" rows="3" class="with-border">
                              {topic.contentData.text}
                            </textarea>
                        </>

                      )}
                      </>
                  </div>
                ))}
              </ReactSortable>
              
              <span className="topic-item">
                <button
                  type="button"
                  onClick={() =>
                    setCourseData((prevState) => {
                      const curriculum = [...prevState.curriculum];
                      curriculum[moduleIndex].courseTopics.push({
                        topicName: "hello",
                        contentData: { file: null, contentType: "VIDEO" },
                      });
                      return { ...prevState, curriculum };
                    })
                  }
                >
                  Add Topic
                </button>
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setCourseData((prevState) => ({
                ...prevState,
                curriculum: [
                  ...prevState.curriculum,
                  {
                    moduleName: "",
                    courseTopics: [
                      {
                        topicName: "",
                        contentData: { file: null, contentType: "FILE" },
                      },
                    ],
                  },
                ],
              }))
            }
          >
            Add Module
          </button>
          <hr />
        </div>

        <label htmlFor="tags">Tags:</label>
        {courseData.tags.map((item, index) => (
          <div key={index} className="item">
            <input
              type="text"
              id="tags"
              name="tags"
              key={index}
              value={item}
              onChange={(e) => handleTagChange(e, index)}
            />
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="remove-button remove_button"
            >
              Remove
            </button>
          </div>
        ))}
        {courseData.tags.length < 3 && (
          <button
            type="button"
            onClick={() => {
              setCourseData((prevState) => ({
                ...prevState,
                tags: [...prevState.tags, ""],
              }));
            }}
          >
            Add Tag
          </button>
        )}
        <hr />
        <div>
          <label htmlFor="previewImage">Preview Picture (Mandatory):</label>
          {courseData?.previewImage && (
            <img
              src={courseData.img_url}
              alt="uploaded file"
              style={{ maxWidth: "600px" }}
            />
          )}
          <input
            type="file"
            id="previewImage"
            name="previewImage"
            accept="image/*"
            onChange={handlePreviewPictureChange}
            required
          />
        </div>
        <div>
          <label htmlFor="promoVideo">Promo Video (Mandatory):</label>
          {courseData?.promoVideo && (
            <VideoPlayer
              videoSrc={courseData.video_url}
            />
          )}
          <input
            type="file"
            id="promoVideo"
            name="promoVideo"
            accept="video/*"
            onChange={handlePromoVideoChange}
            required
          />
        </div>

        <div className="flex justify-flex">
          <button type="submit" onClick={handlePublishCourse}>
            Publish course
          </button>
          <button type="submit" onClick={handleSaveAsDraft}>
            Save draft
          </button>
          <button type="button" onClick={handleDeleteCourse}>
            Delete course (no confirmation!)
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreationPage;