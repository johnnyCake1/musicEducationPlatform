import React, { useState } from "react";
import "./CourseCreationPage.css";
import { FaBook, FaCheck } from "react-icons/fa";
import useLocalStorageState from "../../util/useLocalStorageState";

const CourseCreationPage = () => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [courseData, setCourseData] = useState({
    authorId: currentUser.id,
    courseName: "",
    price: 0,
    courseShortDescription: "",
    courseLongDescription: "",
    requirements: [],
    whatYouWillLearn: [],
    curriculum: [],
    tags: [],
    previewPicture: null,
    promoVideo: null,
  });

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
    // console.log("----------------START------------------");
    // console.log("curriculum change!");
    // console.log("moduleIndex:", moduleIndex);
    // console.log("topicIndex:", topicIndex);
    // console.log("name:", name);
    // console.log("value:", value);
    // console.log("type:", type);
    // console.log("files:", files);
    // console.log("---------------END-------------------");

    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      if (type === "file") {
        console.log("oh file!:", files[0]);
        curriculum[moduleIndex].courseTopics[
          topicIndex
        ].contentData.contentType = "FILE";
        curriculum[moduleIndex].courseTopics[topicIndex].contentData.file =
          files[0];
      } else {
        curriculum[moduleIndex].courseTopics[topicIndex][name] = value;
      }
      return { ...prevState, curriculum };
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
    setCourseData((prevState) => ({ ...prevState, previewPicture: file }));
  };

  const handlePromoVideoChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setCourseData((prevState) => ({ ...prevState, promoVideo: file }));
  };

  // Create a new course with file uploads
  const createCourse = async () => {
    // Prepare the file objects
    const previewImageFile = courseData.previewPicture;
    const promoVideoFile = courseData.promoVideo;
    // Create the FormData object to send the request
    const formData = new FormData();
    formData.append("previewPicture", previewImageFile);
    formData.append("promoVideo", promoVideoFile);
    // Append the course data JSON string to the FormData object
    formData.append("courseDataJson", JSON.stringify(courseData));

    // Append the contentDataFiles individually
    const contentDataFiles = [];
    for (const module of courseData.curriculum) {
      for (const topic of module.courseTopics) {
        const contentDataFile = topic.contentData.file;
        if (contentDataFile) {
          contentDataFiles.push(contentDataFile);
        }
      }
    }
    for (let i = 0; i < contentDataFiles.length; i++) {
      formData.append("contentDataFiles", contentDataFiles[i]);
    }
    // Send the request
    try {
      const response = await fetch("/api/v1/courses", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Course created successfully.");
      } else {
        console.error("Failed to create course.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform further actions with the courseData object
    console.log("final data sent:", courseData);
    createCourse();
  };

  return (
    <div className="course-creation-page">
      <h1>Create a Course</h1>
      <form>
        <div>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={courseData.courseName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="price">Course price ($):</label>
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
                    <input
                      type="file"
                      onChange={(e) =>
                        handleCurriculumChange(e, moduleIndex, topicIndex)
                      }
                      name="contentData"
                    />
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
          <label htmlFor="previewPicture">Preview Picture (Mandatory):</label>
          <input
            type="file"
            id="previewPicture"
            name="previewPicture"
            accept="image/*"
            onChange={handlePreviewPictureChange}
            required
          />
        </div>
        <div>
          <label htmlFor="promoVideo">Promo Video (Mandatory):</label>
          <input
            type="file"
            id="promoVideo"
            name="promoVideo"
            accept="video/*"
            onChange={handlePromoVideoChange}
            required
          />
        </div>

        <button onClick={handleSubmit}>Create Course</button>
      </form>
    </div>
  );
};

export default CourseCreationPage;
