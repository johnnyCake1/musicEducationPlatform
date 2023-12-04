import React, { useEffect, useState } from 'react';
import './CourseCreationPage.css';
import { FaBook, FaCheck } from 'react-icons/fa';
import useLocalStorageState from '../../util/useLocalStorageState';
import { useNavigate, useParams } from 'react-router-dom';
import { getFile, httpReqAsync } from '../../services/httpReqAsync';
import VideoPlayer from '../common/VideoPlayer';
import { ReactSortable } from 'react-sortablejs';
import QuizCreator from './QuizCreatiion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Editor from './Editor';

const CourseCreationPage = () => {
  const { courseId } = useParams();
  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [jwt] = useLocalStorageState('', 'jwt');
  const [courseCategories, setCourseCategories] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [courseData, setCourseData] = useState({
    id: courseId,
    authorId: currentUser.id,
    courseName: '',
    price: 0,
    courseShortDescription: '',
    courseLongDescription: '',
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
    //fetch the course data
    httpReqAsync(`/api/v1/courses/${courseId}`, 'GET', jwt).then((result) => {
      //fill out the data
      setCourseData({ ...result, category_id: result.category?.id });

      console.log('fetch result:', result);
    });
    httpReqAsync(`/api/v1/courses/categories`, 'GET', jwt).then((result) => {
      //fill out the data
      setCourseCategories(result);
    });
  }, [jwt, courseId, currentUser, toggleRefresh]);

  if (error || !courseData) {
    return <div>{`Error: ${error}`}</div>;
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    console.log('sas', name, value);
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
    console.log('log', value);
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.contentType =
        value;

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
  const handleTextChange = (value, moduleIndex, topicIndex) => {
    setCourseData((prevState) => {
      const curriculum = [...prevState.curriculum];
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.text = value;
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.contentType =
        'TEXT';

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
      console.log(
        'sdfsdf',
        curriculum[moduleIndex].courseTopics[topicIndex].contentData
      );
      curriculum[moduleIndex].courseTopics[topicIndex].contentData.quiz =
        updatedQuestions;
      const newCourseData = { ...prevState, curriculum };
      return newCourseData;
    });
  };

  const handleUpload = (e, moduleIndex, topicIndex) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      console.log('state of course data before sending file:', courseData);
      httpReqAsync('/api/v1/files', 'POST', jwt, files[0])
        .then((result) => {
          const curriculum = [...courseData.curriculum];
          curriculum[moduleIndex].courseTopics[topicIndex].contentData = {
            ...curriculum[moduleIndex].courseTopics[topicIndex].contentData,
            file_url: result.file_url,
            file_id: result.id,
          };
          const updatedCourseData = { ...courseData, curriculum };
          setCourseData(updatedCourseData);
          updateCourse(jwt, updatedCourseData);
        })
        .catch((err) => {
          console.log('error:', err);
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
    httpReqAsync('/api/v1/files', 'POST', jwt, file)
      .then((result) => {
        const updatedCourseData = {
          ...courseData,
          img_url: result.file_url,
          img_id: result.id,
        };
        setCourseData(updatedCourseData);
        updateCourse(jwt, updatedCourseData);
      })
      .catch((err) => {
        console.log('error:', err);
      });
  };

  const handlePromoVideoChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    httpReqAsync('/api/v1/files', 'POST', jwt, file)
      .then((result) => {
        const updatedCourseData = {
          ...courseData,
          video_url: result.file_url,
          video_id: result.id,
        };
        setCourseData(updatedCourseData);
        updateCourse(jwt, updatedCourseData);
      })
      .catch((err) => {
        console.log('error:', err);
      });
  };

  const handlePublishCourse = (e) => {
    e.preventDefault();

    if (!courseData.img_url) {
      alert('Please upload a preview picture');
      return;
    }
    if (!courseData.video_url) {
      alert('Please upload a promo video');
      return;
    }
    if (!courseData.courseName) {
      alert('Please enter a course name');
      return;
    }
    if (!courseData.courseShortDescription) {
      alert('Please enter a short description');
      return;
    }
    // Confirmation dialog
    const isConfirmed = window.confirm(
      'Are you sure you want to publish this course?'
    );
    if (!isConfirmed) {
      return; // If user cancels, exit the function
    }

    courseData.published = true;
    httpReqAsync(`/api/v1/courses`, 'PUT', jwt, courseData)
      .then((result) => {
        console.log('saved:', result);
        if (result.published) {
          alert('Successfully published course');
          navigate(`/courses/${courseId}/description`);
          return;
        } else {
          alert('Error on the server');
        }
      })
      .catch((err) => {
        console.log('error:', err);
      });
  };

  const handleSaveAsDraft = (e) => {
    e.preventDefault();
    courseData.published = false;
    httpReqAsync(`/api/v1/courses`, 'PUT', jwt, courseData)
      .then((result) => {
        console.log('saved:', result);
        setCourseData(result);
        if (result.id) {
          alert('Successfully saved as draft');
        }
        // setToggleRefresh(!toggleRefresh);
      })
      .catch((err) => {
        console.log('error:', err);
      });
  };

  const handleDeleteCourse = (e) => {
    e.preventDefault();
    window.confirm('Are you sure you want to delete student?') &&
      httpReqAsync(
        `/api/v1/courses/${courseData.id}`,
        'DELETE',
        jwt,
        courseData
      ) &&
      navigate(`/my-courses`);
  };

  return (
    <div className="course-creation-page">
      <h1>Create a Course</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="courseName">
            Course Name: <span className="text-red-500">* (Required)</span>
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
          <label htmlFor="previewImage">
            Preview Picture:<span className="text-red-500">* (Required)</span>
          </label>
          {courseData?.img_url && (
            <img
              src={courseData.img_url}
              alt="uploaded file"
              style={{ maxWidth: '600px' }}
            />
          )}
          <input
            type="file"
            id="previewImage"
            name="previewImage"
            accept="image/*"
            onChange={handlePreviewPictureChange}
          />
        </div>
        <div>
          <label htmlFor="promoVideo">
            Promo Video:<span className="text-red-500">* (Required)</span>
          </label>
          {courseData?.video_url && (
            <VideoPlayer videoSrc={courseData.video_url} />
          )}
          <input
            type="file"
            id="promoVideo"
            name="promoVideo"
            accept="video/*"
            onChange={handlePromoVideoChange}
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
          <label htmlFor="courseCategory">Course Category:</label>
          <select
            name="courseCategory"
            id="category_id"
            defaultValue={courseData?.category?.id}
            onChange={(e) => {
              setCourseData((prev) => ({
                ...prev,
                category_id: e.target.value,
              }));
            }}
          >
            {courseCategories.map((category) => (
              <option
                key={category.id}
                selected={courseData?.category?.id === category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="courseShortDescription">
            Short Description:{' '}
            <span className="text-red-500">* (Required)</span>
          </label>
          <input
            maxLength={250}
            id="courseShortDescription"
            name="courseShortDescription"
            value={courseData.courseShortDescription}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="courseLongDescription">Long Description:</label>
          <Editor
            data={courseData.courseLongDescription}
            onChange={(content) => {
              setCourseData((prevState) => ({
                ...prevState,
                courseLongDescription: content,
              }));
            }}
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
                <ion-icon
                  name="list-outline"
                  style={{ fontSize: 20, cursor: 'move' }}
                />
                &nbsp;
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
                requirements: [...prevState.requirements, ''],
              }))
            }
          >
            <ion-icon name="add-circle-outline" /> Add Requirement
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
                <ion-icon
                  name="list-outline"
                  style={{ fontSize: 20, cursor: 'move' }}
                ></ion-icon>{' '}
                &nbsp;
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
                whatYouWillLearn: [...prevState.whatYouWillLearn, ''],
              }))
            }
          >
            <ion-icon name="add-circle-outline" /> Add Item
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
                    const updatedModule = {
                      ...prevState.curriculum[moduleIndex],
                    };
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
                    <ion-icon
                      name="list-outline"
                      style={{ fontSize: 20, cursor: 'move' }}
                    ></ion-icon>{' '}
                    &nbsp;
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
                    <label htmlFor="contentType" className="mt-2">
                      Content Type:
                    </label>
                    <select
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
                        {topic.contentData.contentType === 'IMAGE' && (
                          <>
                            <img
                              src={
                                topic.contentData.file_url ??
                                'https://uploader-assets.s3.ap-south-1.amazonaws.com/codepen-default-placeholder.png'
                              }
                              alt="topic"
                              style={{ maxWidth: '300px' }}
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
                        {topic.contentData.contentType === 'VIDEO' && (
                          <>
                            {topic.contentData.file_url && (
                              <VideoPlayer
                                videoSrc={topic.contentData.file_url}
                              />
                            )}
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleUpload(e, moduleIndex, topicIndex)
                              }
                              name="contentData"
                            />
                          </>
                        )}
                        {topic.contentData.contentType === 'DOC' && (
                          <>
                            <iframe
                              src={topic.contentData.file_url}
                              title="title"
                            >
                              Presss me:{' '}
                              <a href="./resources/crayola.pdf">Download PDF</a>
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
                      {topic.contentData.contentType === 'QUIZ' && (
                        <>
                          <QuizCreator
                            handleQuizUpdate={handleQuizUpdate}
                            topicIndex={topicIndex}
                            moduleIndex={moduleIndex}
                            quizData={topic.contentData.quiz}
                          />
                        </>
                      )}
                      {topic.contentData.contentType === 'TEXT' && (
                        <>
                          <Editor
                            data={topic.contentData.text}
                            onChange={(content) => {
                              handleTextChange(
                                content,
                                moduleIndex,
                                topicIndex
                              );
                            }}
                          />
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
                        topicName: '',
                        contentData: { file: null, contentType: 'VIDEO' },
                      });
                      return { ...prevState, curriculum };
                    })
                  }
                >
                  <ion-icon name="add-circle-outline" /> Add Topic{' '}
                  {module?.moduleName ? `for ` + module?.moduleName : ''}
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
                    moduleName: '',
                    courseTopics: [
                      {
                        topicName: '',
                        contentData: { file: null, contentType: 'VIDEO' },
                      },
                    ],
                  },
                ],
              }))
            }
          >
            <ion-icon name="add-circle-outline" /> Add New Module
          </button>
          <hr />
        </div>

        <div>
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
        </div>
        {courseData.tags.length < 3 && (
          <button
            type="button"
            onClick={() => {
              setCourseData((prevState) => ({
                ...prevState,
                tags: [...prevState.tags, ''],
              }));
            }}
          >
            <ion-icon name="add-circle-outline" /> Add Tag
          </button>
        )}
        <hr />

        <div className="flex justify-flex mt-4">
          <button
            type="submit"
            className="save_draft"
            onClick={handleSaveAsDraft}
          >
            Save as a Draft
          </button>

          <button
            type="submit"
            className="ml-5 save_publish"
            onClick={handlePublishCourse}
          >
            Publish this course
          </button>
        </div>

        <div className="flex mt-16">
          <span
            type="button"
            className="p-2 rounded-md hover:bg-red-800 flex items-center space-x-1 bg-red-500 text-white cursor-pointer"
            onClick={handleDeleteCourse}
          >
            <ion-icon name="trash" /> Delete this course
          </span>
        </div>
      </form>
    </div>
  );
};

const updateCourse = (jwt, updatedCourseData) => {
  httpReqAsync(`/api/v1/courses`, 'PUT', jwt, updatedCourseData)
    .then((result) => {
      console.log('saved:', result);
    })
    .catch((err) => {
      console.log('error:', err);
    });
};
export default CourseCreationPage;
