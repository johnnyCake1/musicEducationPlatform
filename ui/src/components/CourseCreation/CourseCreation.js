import React, { useEffect, useState } from "react";
import "./CourseCreationPage.css";
import { FaBook, FaCheck } from "react-icons/fa";
import useLocalStorageState from "../../util/useLocalStorageState";
import { useNavigate, useParams } from "react-router-dom";
import { getFile, httpReqAsync } from "../../services/httpReqAsync";
import VideoPlayer from "../common/VideoPlayer";

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
      if (
        String(currentUser.id) !== String(result.authorId) ||
        result.published
      ) {
        console.log(
          "This user cannot access this page or the course was not a draft"
        );
        navigate("/my-courses");
        setError(
          "This user cannot access this page or the course was not a draft"
        );
        return;
      }

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

    if (type === "file") {
      console.log("state of course data before sending file:", courseData);
      httpReqAsync("/api/v1/files", "POST", jwt, files[0]).then((result) => {
        console.log("state of course data after sending file:", courseData);
        setCourseData((prevState) => {
          const curriculum = [...prevState.curriculum];
          curriculum[moduleIndex].courseTopics[topicIndex].contentData = {
            contentType: "FILE",
            file: files[0],
            fileId: result,
          };
          return { ...prevState, curriculum };
        });
      });

      return;
    }

    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics[topicIndex][name] = value;

      const newCourseData = { ...prevState, curriculum };
      return newCourseData;
    });
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
      setCourseData((prevState) => ({
        ...prevState,
        previewImage: file,
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
      setToggleRefresh(!toggleRefresh);
    });
  };

  const handleDeleteCourse = (e) => {
    e.preventDefault();
    httpReqAsync(`/api/v1/courses/${courseData.id}`, "DELETE", jwt, courseData);
    navigate(`/my-courses`);
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
          {courseData.requirements.map((requirement, index) => (
            <div key={index} className="item">
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
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
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
          {courseData.whatYouWillLearn.map((item, index) => (
            <div key={index} className="item">
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
                  className="remove-button"
                >
                  Remove
                </button>
              </span>
            </div>
          ))}
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
                className="remove-button"
              >
                Remove Module
              </button>
              {module.courseTopics.map((topic, topicIndex) => (
                <div className="topic-item" key={topicIndex}>
                  <label htmlFor={`topic-${moduleIndex}-${topicIndex}`}>
                    Topic Name:
                  </label>
                  <input
                    type="text"
                    id={`topic-${moduleIndex}-${topicIndex}`}
                    value={topic.topicName}
                    onChange={(e) =>
                      handleCurriculumChange(e, moduleIndex, topicIndex)
                    }
                    name="topicName"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(moduleIndex, topicIndex)}
                    className="remove-button"
                  >
                    Remove topic
                  </button>
                  <select
                    value={topic.contentData.contentType}
                    onChange={(e) =>
                      handleCurriculumChange(e, moduleIndex, topicIndex)
                    }
                    name="contentType"
                  >
                    <option value="FILE">File</option>
                    {/* Add more content type options */}
                  </select>
                  {topic.contentData.contentType === "FILE" && (
                    // setPicSrc()
                    <>
                      {topic?.contentData?.file && (
                        <>
                          {topic.contentData.file.type.startsWith("image/") && (
                            <img
                              src={URL.createObjectURL(topic.contentData.file)}
                              alt="topic"
                              style={{ maxWidth: "500px" }}
                            />
                          )}
                          {topic.contentData.file.type.startsWith("video/") && (
                            <VideoPlayer
                              videoSrc={URL.createObjectURL(
                                topic.contentData.file
                              )}
                            />
                          )}
                        </>
                      )}
                      <input
                        type="file"
                        onChange={(e) =>
                          handleCurriculumChange(e, moduleIndex, topicIndex)
                        }
                        name="contentData"
                      />
                    </>
                  )}
                </div>
              ))}
              <span className="topic-item">
                <button
                  type="button"
                  onClick={() =>
                    setCourseData((prevState) => {
                      const curriculum = [...prevState.curriculum];
                      curriculum[moduleIndex].courseTopics.push({
                        topicName: "",
                        contentData: { file: null, contentType: "FILE" },
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
              className="remove-button"
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
              src={URL.createObjectURL(courseData?.previewImage)}
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
              videoSrc={URL.createObjectURL(courseData.promoVideo)}
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

        <button type="submit" onClick={handlePublishCourse}>
          Publish course
        </button>
        <button type="submit" onClick={handleSaveAsDraft}>
          Save draft
        </button>
        <button type="button" onClick={handleDeleteCourse}>
          Delete course (no confirmation!)
        </button>
      </form>
    </div>
  );
};

export default CourseCreationPage;
