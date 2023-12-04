package com.zheenbek.music_learn.service;

import com.sun.istack.NotNull;
import com.zheenbek.music_learn.config.exceptions.ResourceNotFoundException;
import com.zheenbek.music_learn.dto.request.course.CourseRequestDTO;
import com.zheenbek.music_learn.dto.request_response.ReviewDTO;
import com.zheenbek.music_learn.dto.response.course.CategoryResponseDTO;
import com.zheenbek.music_learn.dto.request_response.course.ContentDataDTO;
import com.zheenbek.music_learn.dto.response.course.CourseResponseDTO;
import com.zheenbek.music_learn.dto.request_response.course.CourseModuleDTO;
import com.zheenbek.music_learn.dto.request_response.course.CourseTopicDTO;
import com.zheenbek.music_learn.entity.course.Category;
import com.zheenbek.music_learn.entity.course.ContentData;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.course.CourseModule;
import com.zheenbek.music_learn.entity.course.CourseTopic;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.course.Question;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.course.CategoryRepository;
import com.zheenbek.music_learn.repository.course.ContentDataRepository;
import com.zheenbek.music_learn.repository.course.CourseModuleRepository;
import com.zheenbek.music_learn.repository.course.CourseRepository;
import com.zheenbek.music_learn.repository.course.CourseTopicRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.course.QuestionRepository;
import com.zheenbek.music_learn.repository.ReviewRepository;
import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.zheenbek.music_learn.service.FileService.FILES_SERVING_ENDPOINT;
import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;
import static com.zheenbek.music_learn.service.UserService.mapUserToDto;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final FileRepository fileRepository;
    private final CourseTopicRepository courseTopicRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ServerFileStorageService serverFileStorageService;
    private final ContentDataRepository contentDataRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;


    @Autowired
    public CourseService(CourseRepository courseRepository,
                         FileRepository fileRepository,
                         CourseTopicRepository courseTopicRepository,
                         CourseModuleRepository courseModuleRepository,
                         ServerFileStorageService serverFileStorageService,
                         UserRepository userRepository,
                         ReviewRepository reviewRepository,
                         ContentDataRepository contentDataRepository,
                         CategoryRepository categoryRepository,
                         QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.courseTopicRepository = courseTopicRepository;
        this.contentDataRepository = contentDataRepository;
        this.fileRepository = fileRepository;
        this.serverFileStorageService = serverFileStorageService;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
    }

    public Course findCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found to delete with ID: " + id));
    }

    public List<CourseResponseDTO> getAllCourses(boolean onlyPublished) {
        return courseRepository.findAll().stream()
                .filter(course -> !onlyPublished || course.isPublished())
                .map(CourseService::mapCourseToDto).collect(Collectors.toList());
    }

    @Transactional
    public CourseResponseDTO createCourse(CourseRequestDTO courseDTO, MultipartFile promoVideo, MultipartFile previewPicture, MultipartFile[] orderedTopicContentFiles) throws IOException {
        //convert CourseDTO to Course entity
        Course course = mapRequestDtoToCourse(courseDTO);
        //create the files in the system and database and append to the entity
        //save in the system:
        File storedVideoFile = serverFileStorageService.storeFile(promoVideo, course.getCourseName());
        File storedPictureFile = serverFileStorageService.storeFile(previewPicture, course.getCourseName());
        //save in the database:
        FileEntity courseVideoEntity = fileRepository.save(fileEntityFromFile(storedVideoFile, promoVideo.getContentType()));
        FileEntity coursePictureEntity = fileRepository.save(fileEntityFromFile(storedPictureFile, previewPicture.getContentType()));
        //append:
        course.setPromoVideo(courseVideoEntity);
        course.setPreviewImage(coursePictureEntity);
        //record the dates
        course.setCreationDate(new Date());
        course.setLastUpdatedDate(new Date());

        int topicFileIndex = 0;
        for (CourseModule module : course.getCurriculum()) {
            for (CourseTopic topic : module.getCourseTopics()) {
                if (topic.getContentData() != null) {
                    switch (topic.getContentData().getContentType()) {
                        case IMAGE:
                        case DOC:
                        case VIDEO:
                        case FILE: {
                            MultipartFile topicContentFile = orderedTopicContentFiles[topicFileIndex++];
                            //save in the system:
                            File file = serverFileStorageService.storeFile(topicContentFile, topic.getTopicName());
                            //save in the database:
                            FileEntity fileEntity = fileRepository.save(fileEntityFromFile(file, topicContentFile.getContentType()));
                            //append:
                            topic.getContentData().setFile(fileEntity);
                            break;
                        }
                        case QUIZ: {
                            if (topic.getContentData().getQuiz() != null) {
                                questionRepository.saveAll(topic.getContentData().getQuiz());
                            }
                            break;
                        }
                        case UNKNOWN: {
                            break;
                        }
                        default: {
                            topic.getContentData().setContentType(ContentData.ContentType.UNKNOWN);
                            break;
                        }
                    }
                    contentDataRepository.save(topic.getContentData());
                }
                courseTopicRepository.save(topic);
            }
            courseModuleRepository.save(module);
        }

        //finally save the course
        return mapCourseToDto(courseRepository.save(course));
    }

    public CourseResponseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        return mapCourseToDto(course);
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found to delete with ID: " + courseId));
        course.getCurriculum().forEach(this::deleteCourseModule);
        userRepository.findAll()
                .forEach(user -> {
                    user.getDraftCourses().remove(course);
                    user.getPublishedCourses().remove(course);
                    user.getSavedCourses().remove(course);
                    user.getTakenCourses().remove(course);
                    userRepository.save(user);
                });
        courseRepository.delete(course);
    }

    @Transactional
    public void deleteCourseModule(Long courseId, Long courseModuleId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found to delete with ID: " + courseId));
        course.getCurriculum()
                .stream()
                .filter(module -> Objects.equals(module.getId(), courseModuleId))
                .findFirst().ifPresent(this::deleteCourseModule);
    }

    public void deleteCourseTopic(Long courseId, Long courseModuleId, Long topicId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found to delete with ID: " + courseId));
        course.getCurriculum()
                .stream()
                .filter(module -> Objects.equals(module.getId(), courseModuleId))
                .findFirst()
                .flatMap(module -> module.getCourseTopics().stream()
                        .filter(topic -> Objects.equals(topic.getId(), topicId))
                        .findFirst()).ifPresent(this::deleteCourseTopic);
    }

    private void deleteCourseModule(CourseModule moduleToDelete) {
        moduleToDelete.getCourseTopics().forEach(this::deleteCourseTopic);
    }

    private void deleteCourseTopic(CourseTopic courseTopicToDelete) {
        ContentData contentData = courseTopicToDelete.getContentData();
        if (contentData != null) {
            if (contentData.getFile() != null) {
//                //delete old file from the file system
//                serverFileStorageService.deleteProfilePicture(contentData.getFile().getFileName());
//                //delete old file from the database
//                fileRepository.delete(contentData.getFile());
            }
            contentDataRepository.delete(courseTopicToDelete.getContentData());
        }
        courseTopicRepository.delete(courseTopicToDelete);
    }

    @Transactional
    public CourseResponseDTO createEmptyDraftCourseForUser(Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author user not found with ID: " + authorId));
        Course newCourse = new Course();
        newCourse.setAuthor(author);
        newCourse.setCourseName("");
        newCourse.setCourseLongDescription("");
        newCourse.setCourseShortDescription("");
        newCourse.setPrice(0);
        Course savedCourse = courseRepository.save(newCourse);
        author.getDraftCourses().add(savedCourse);
        userRepository.save(author);
        return mapCourseToDto(savedCourse);
    }

    @Transactional
    public CourseModuleDTO createEmptyModule(Long courseId) {
        Course draftCourse = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Draft course not found with ID: " + courseId));
        CourseModule newModule = new CourseModule();
        newModule.setModuleName("");
        CourseModule savedModule = courseModuleRepository.save(newModule);
        draftCourse.getCurriculum().add(newModule);
        courseRepository.save(draftCourse);
        return mapCourseModuleToDto(savedModule);
    }

    @Transactional
    public CourseTopicDTO createEmptyTopic(Long courseId, Long moduleId) {
        Course draftCourse = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Draft course not found with ID: " + courseId));
        CourseModule courseModule = draftCourse.getCurriculum()
                .stream()
                .filter(module -> Objects.equals(module.getId(), moduleId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Module with ID: " + moduleId + " does not belong to course with ID:" + courseId));
        CourseTopic newTopic = new CourseTopic();
        newTopic.setTopicName("");
        newTopic.setContentData(new ContentData());
        CourseTopic savedTopic = courseTopicRepository.save(newTopic);
        courseModule.getCourseTopics().add(newTopic);
        courseModuleRepository.save(courseModule);
        return mapCourseTopicToDto(savedTopic);
    }

    @Transactional
    public CourseResponseDTO createOrUpdateDraftCourseForUser(CourseRequestDTO courseDTO) {
        if (courseDTO.getAuthorId() == null) {
            throw new EntityNotFoundException("trying to create/update course with no author");
        }
        User author = userRepository.findById(courseDTO.getAuthorId()).orElseThrow(() -> new EntityNotFoundException("Author user not found with ID: " + courseDTO.getAuthorId()));

        //if a course came with an id, then update else create
        if (courseDTO.getId() != null) {
            Course course = courseRepository.findById(courseDTO.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Course not found to update with ID: " + courseDTO.getId()));
            if (course.getAuthor() == null || !Objects.equals(course.getAuthor().getId(), courseDTO.getAuthorId())) {
                throw new EntityNotFoundException("Course not found with ID" + courseDTO.getId() + " that has the user as author with ID: " + courseDTO.getAuthorId());
            }
            boolean oldPublishedStated = course.isPublished();
            //update course with given object
            Course updatedCourse = saveCourse(mapRequestDtoToCourse(courseDTO));
            //if it went from published to not published, then we move it to drafts. And if it went from not published to published then we move it to published
            if (updatedCourse.isPublished() != oldPublishedStated) {
                if (updatedCourse.isPublished()) {
                    author.getDraftCourses().remove(updatedCourse);
                    author.getPublishedCourses().add(updatedCourse);
                } else {
                    author.getPublishedCourses().remove(updatedCourse);
                    author.getDraftCourses().add(updatedCourse);
                }
                //update user
                userRepository.save(author);
            }
            return mapCourseToDto(updatedCourse);
        }
        //create
        Course courseToSave = mapRequestDtoToCourse(courseDTO);
        courseToSave.setLastUpdatedDate(new Date());
        if (courseToSave.getCreationDate() == null) {
            courseToSave.setCreationDate(new Date());
        }
        Course createdDraftCourse = saveCourse(courseToSave);
        createdDraftCourse.setLastUpdatedDate(new Date());
        //update author
        author.getDraftCourses().add(createdDraftCourse);
        userRepository.save(author);
        return mapCourseToDto(createdDraftCourse);
    }

    private Course saveCourse(Course course) {
        course.getCurriculum().forEach(this::saveCourseModule);
        return courseRepository.save(course);
    }

    private void saveCourseModule(CourseModule courseModule) {
        courseModule.getCourseTopics().forEach(this::saveCourseTopic);
        courseModuleRepository.save(courseModule);
    }

    private void saveCourseTopic(CourseTopic courseTopic) {
        ContentData contentData = courseTopic.getContentData();
        if (contentData != null) {
            if (contentData.getFile() != null) {
                //append:
                fileRepository.save(contentData.getFile());
            }
            if (contentData.getQuiz() != null) {
                questionRepository.saveAll(contentData.getQuiz());
            }
            contentDataRepository.save(contentData);
        }
        courseTopicRepository.save(courseTopic);
    }

    public List<CourseResponseDTO> getAllDraftCoursesByAuthorId(Long userId) {
        List<Course> courses = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getDraftCourses();
        return courses.stream().map(CourseService::mapCourseToDto).collect(Collectors.toList());
    }

    public List<CourseResponseDTO> getAllCoursesByAuthorId(Long authorId, boolean onlyPublished) {
        return courseRepository.findAllByAuthorId(authorId).stream()
                .filter(e -> onlyPublished && e.isPublished())
                .map(CourseService::mapCourseToDto).collect(Collectors.toList());
    }

    public List<CourseResponseDTO> findCoursesByKeyword(String keyword) {
        return courseRepository.searchCoursesByKeyword(keyword).stream().map(CourseService::mapCourseToDto).collect(Collectors.toList());
    }

    public List<CourseResponseDTO> findCoursesByKeyword(String keyword, Long userId) {
        return courseRepository.searchCoursesByKeyword(keyword, userId).stream().map(CourseService::mapCourseToDto).collect(Collectors.toList());
    }

    public File getPreviewPictureByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        if (course.getPreviewImage() == null) {
            return null;
        }
        return new File(course.getPreviewImage().getFilePath());
    }

    public File getCourseVideoByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        if (course.getPromoVideo() == null) {
            return null;
        }
        return new File(course.getPromoVideo().getFilePath());
    }

    public List<Review> getCourseReviews(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        return course.getReviews();
    }

    public CourseResponseDTO convertToDraft(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found to convert to draft with ID: " + courseId));
        User author = course.getAuthor();
        if (!author.getDraftCourses().contains(course)) {
            author.getDraftCourses().add(course);
        }
        author.getPublishedCourses().remove(course);
        userRepository.save(author);
        course.setPublished(false);
        return mapCourseToDto(courseRepository.save(course));
    }

    @Transactional
    public CourseResponseDTO enrollUser(Long courseId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        return enrollUser(course, user);
    }

    @Transactional
    public CourseResponseDTO enrollUser(@NotNull Course course, @NotNull User user) {
        System.out.println("Trying to enroll");
        if (!user.getTakenCourses().contains(course)) {
            user.getTakenCourses().add(course);
            userRepository.save(user);
        }
        if (!course.getEnrolledStudents().contains(user)) {
            course.getEnrolledStudents().add(user);
            courseRepository.save(course);
        }
        System.out.println("Enroll saved");
        return mapCourseToDto(course);
    }

    public Course dropUser(Long courseId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        user.getTakenCourses().remove(course);
        userRepository.save(user);
        course.getEnrolledStudents().remove(user);
        courseRepository.save(course);
        return course;
    }

    @Transactional
    public List<Review> addReviewToCourse(Long courseId, Review review) {
        Review newReview = reviewRepository.save(review);
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        course.getReviews().add(newReview);
        return courseRepository.save(course).getReviews();
    }

    @Transactional
    public List<Review> removeReviewFromCourse(Long courseId, Long reviewId) {
        Review reviewToDelete = reviewRepository.findById(reviewId).orElseThrow(() -> new EntityNotFoundException("Review not found with ID: " + reviewId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        course.getReviews().remove(reviewToDelete);
        List<Review> updatedReviews = courseRepository.save(course).getReviews();
        reviewRepository.delete(reviewToDelete);
        return updatedReviews;
    }

    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(CourseService::mapCategoryToDto).collect(Collectors.toList());
    }

    private Course mapRequestDtoToCourse(CourseRequestDTO courseDTO) {
        Course course = new Course();
        course.setId(courseDTO.getId());
        course.setCourseName(courseDTO.getCourseName());
        course.setCourseLongDescription(courseDTO.getCourseLongDescription());
        course.setCourseShortDescription(courseDTO.getCourseShortDescription());
        course.setPrice(courseDTO.getPrice());
        course.setRequirements(courseDTO.getRequirements());
        course.setWhatYouWillLearn(courseDTO.getWhatYouWillLearn());
        course.setTags(courseDTO.getTags());
        course.setReviews(courseDTO.getReviews());
        course.setCreationDate(courseDTO.getCreationDate());
        course.setLastUpdatedDate(courseDTO.getLastUpdatedDate());
        course.setPublished(courseDTO.isPublished());
        if (courseDTO.getCategoryId() != null) {
            course.setCategory(categoryRepository.findById(courseDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Provided category was not found with ID: " + courseDTO.getCategoryId())));
        }
        if (courseDTO.getAuthorId() != null) {
            course.setAuthor(userRepository.findById(courseDTO.getAuthorId()).orElseThrow(() -> new EntityNotFoundException("Course author not found with ID: " + courseDTO.getAuthorId())));
        }
        if (courseDTO.getPreviewImageId() != null) {
            course.setPreviewImage(fileRepository.findById(courseDTO.getPreviewImageId()).orElseThrow(() -> new EntityNotFoundException("Course preview image file entity not found with ID: " + courseDTO.getPreviewImageId())));
        }
        if (courseDTO.getPromoVideoId() != null) {
            course.setPromoVideo(fileRepository.findById(courseDTO.getPromoVideoId()).orElseThrow(() -> new EntityNotFoundException("Course promo video file entity not found with ID: " + courseDTO.getPromoVideoId())));
        }
        course.setEnrolledStudents(courseDTO.getEnrolledStudentsIds().stream().map(id -> userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Course student not found with ID: " + id))).collect(Collectors.toList()));
        course.setSavedInUsers(courseDTO.getSavedInStudentsIds().stream().map(id -> userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id + " who has course saved with ID:" + course.getId()))).collect(Collectors.toList()));
        if (courseDTO.getCurriculum() != null) {
            course.setCurriculum(courseDTO.getCurriculum().stream().map(this::mapDtoToCourseModule).collect(Collectors.toList()));
        }
        return course;
    }

    private CourseModule mapDtoToCourseModule(CourseModuleDTO courseModuleDTO) {
        CourseModule courseModule = new CourseModule();
        courseModule.setModuleName(courseModuleDTO.getModuleName());
        if (courseModuleDTO.getCourseTopics() != null) {
            courseModule.setCourseTopics(courseModuleDTO.getCourseTopics().stream().map(this::mapDtoToCourseTopic).collect(Collectors.toList()));
        }
        return courseModule;
    }

    private CourseTopic mapDtoToCourseTopic(CourseTopicDTO courseTopicDTO) {
        CourseTopic courseTopic = new CourseTopic();
        courseTopic.setTopicName(courseTopicDTO.getTopicName());
        if (courseTopicDTO.getContentData() != null) {
            courseTopic.setContentData(mapDtoToContentData(courseTopicDTO.getContentData()));
        }
        return courseTopic;
    }

    private ContentData mapDtoToContentData(ContentDataDTO contentDataDTO) {
        ContentData contentData = new ContentData();
        contentData.setContentType(contentDataDTO.getContentType());
        if (contentDataDTO.getQuiz() != null) {
            contentData.setQuiz(contentDataDTO.getQuiz().stream().map(this::mapDtoToQuiz).collect(Collectors.toList()));
        }
        if (contentDataDTO.getFileId() != null) {
            contentData.setFile(fileRepository.findById(contentDataDTO.getFileId()).orElseThrow(() -> new EntityNotFoundException("Content data file entity not found with ID: " + contentDataDTO.getFileId())));
        }
        if (contentDataDTO.getText() != null) {
            contentData.setText(contentDataDTO.getText());
        }
        return contentData;
    }

    private Question mapDtoToQuiz(Question questionDTO) {
        if (questionDTO.getId() != null) {
            return questionRepository.findById(questionDTO.getId()).orElseThrow(() -> new EntityNotFoundException("Question entity not found with ID: " + questionDTO.getId()));
        }
        return questionDTO;
    }

    public static CourseResponseDTO mapCourseToDto(Course course) {
        CourseResponseDTO courseDTO = new CourseResponseDTO();
        courseDTO.setId(course.getId());
        if (course.getAuthor() != null) {
            courseDTO.setAuthor(mapUserToDto(course.getAuthor()));
        }
        courseDTO.setSavedInStudentsIds(course.getSavedInUsers().stream().map(User::getId).collect(Collectors.toList()));
        courseDTO.setCourseLongDescription(course.getCourseLongDescription());
        courseDTO.setCourseName(course.getCourseName());
        courseDTO.setPrice(course.getPrice());
        courseDTO.setCourseShortDescription(course.getCourseShortDescription());
        courseDTO.setWhatYouWillLearn(course.getWhatYouWillLearn());
        courseDTO.setRequirements(course.getRequirements());
        courseDTO.setTags(course.getTags());
        courseDTO.setReviews(course.getReviews().stream().map(CourseService::mapReviewToDto).collect(Collectors.toList()));
        courseDTO.setCreationDate(course.getCreationDate());
        courseDTO.setLastUpdatedDate(course.getLastUpdatedDate());
        courseDTO.setPublished(course.isPublished());
        if (course.getCategory() != null) {
            courseDTO.setCategory(mapCategoryToDto(course.getCategory()));
        }
        if (course.getPreviewImage() != null) {
            courseDTO.setPreviewImageId(course.getPreviewImage().getId());
            courseDTO.setPreviewImagePath(FILES_SERVING_ENDPOINT + '/' + course.getPreviewImage().getFileName());
        }
        if (course.getPromoVideo() != null) {
            courseDTO.setPromoVideoId(course.getPromoVideo().getId());
            courseDTO.setPromoVideoPath(FILES_SERVING_ENDPOINT + '/' + course.getPromoVideo().getFileName());
        }
        if (course.getAuthor() != null) {
            courseDTO.setAuthorId(course.getAuthor().getId());
        }
        if (course.getEnrolledStudents() != null) {
            courseDTO.setEnrolledStudentsIds(course.getEnrolledStudents().stream().map(User::getId).collect(Collectors.toList()));
            courseDTO.setEnrolledStudents(course.getEnrolledStudents().stream().map(UserService::mapUserToDto).collect(Collectors.toList()));
        }
        if (course.getCurriculum() != null) {
            courseDTO.setCurriculum(course.getCurriculum().stream().map(CourseService::mapCourseModuleToDto).collect(Collectors.toList()));
        }
        return courseDTO;
    }

    public static CategoryResponseDTO mapCategoryToDto(Category category) {
        CategoryResponseDTO categoryDTO = new CategoryResponseDTO();
        categoryDTO.setName(category.getName());
        categoryDTO.setId(category.getId());
        if (category.getPicture() != null) {
            categoryDTO.setPicturePath(FILES_SERVING_ENDPOINT + '/' + category.getPicture().getFileName());
        }
        return categoryDTO;
    }

    public static CourseModuleDTO mapCourseModuleToDto(CourseModule courseModule) {
        CourseModuleDTO courseModuleDTO = new CourseModuleDTO();
        courseModuleDTO.setId(courseModule.getId());
        courseModuleDTO.setModuleName(courseModule.getModuleName());
        if (courseModule.getCourseTopics() != null) {
            courseModuleDTO.setCourseTopics(courseModule.getCourseTopics().stream().map(CourseService::mapCourseTopicToDto).collect(Collectors.toList()));
        }
        return courseModuleDTO;
    }

    public static CourseTopicDTO mapCourseTopicToDto(CourseTopic courseTopic) {
        CourseTopicDTO courseTopicDTO = new CourseTopicDTO();
        courseTopicDTO.setId(courseTopic.getId());
        courseTopicDTO.setTopicName(courseTopic.getTopicName());
        if (courseTopic.getContentData() != null) {
            courseTopicDTO.setContentData(mapContentDataToDto(courseTopic.getContentData()));
        }
        return courseTopicDTO;
    }

    public static ContentDataDTO mapContentDataToDto(ContentData contentData) {
        ContentDataDTO contentDataDTO = new ContentDataDTO();
        contentDataDTO.setId(contentData.getId());
        contentDataDTO.setContentType(contentData.getContentType());
        if (contentData.getFile() != null) {
            contentDataDTO.setFileId(contentData.getFile().getId());
            contentDataDTO.setFilePath(FILES_SERVING_ENDPOINT + '/' + contentData.getFile().getFileName());
        }
        if (contentData.getQuiz() != null && !contentData.getQuiz().isEmpty()) {
            contentDataDTO.setQuiz(contentData.getQuiz());
        }
        if (contentData.getText() != null) {
            contentDataDTO.setText(contentData.getText());
        }
        return contentDataDTO;
    }

    public static ReviewDTO mapReviewToDto(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(review.getId());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setReviewMessage(review.getReviewMessage());
        if (review.getReviewer() != null){
            reviewDTO.setReviewer(mapUserToDto(review.getReviewer()));
        }
        return reviewDTO;
    }

    public CategoryResponseDTO getCategoryById(Long categoryId) {
        return mapCategoryToDto(categoryRepository.findById(categoryId).orElseThrow(() -> new EntityNotFoundException("Category not found to get with ID: " + categoryId)));
    }

    public List<CourseResponseDTO> getAllCoursesByCategory(Long categoryId) {
        List<Course> foundCourses = courseRepository.findAllByCategoryId(categoryId);
        return foundCourses.stream().map(CourseService::mapCourseToDto).collect(Collectors.toList());
    }

    public List<CourseResponseDTO> getRecommendedCoursesForUser(Long userId) {
        System.out.println("Recommended courses initiated for user: " + userId);
        // we recommend by taken courses: type should be same
        // we recommend by saved courses: keywords should be same
        // if no taken courses and no saved items, then same as explore page
        List<CourseResponseDTO> relatedCourses = new ArrayList<>();
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        user.getTakenCourses()
                .forEach((course) -> {
                    relatedCourses.addAll(getRelatedCourses(course, userId));
                });
        user.getSavedCourses()
                .forEach((course) -> {
                    relatedCourses.addAll(getRelatedCourses(course, userId));
                });
        System.out.println("Related courses size:" + relatedCourses.size());
        // remove duplicate course objects:
        Set<CourseResponseDTO> set = new LinkedHashSet<>(relatedCourses);

        if (set.size() <= 3) {
            //find some random courses up to 10
            int n = 10 - set.size();
            List<CourseResponseDTO> randomCourses = courseRepository.findRandomCourses(n, userId)
                    .stream()
                    .map(CourseService::mapCourseToDto)
                    .collect(Collectors.toList());
            System.out.println("Random courses size: " + randomCourses.size());
            set.addAll(randomCourses);
        }
        return new ArrayList<>(set);
    }

    private List<CourseResponseDTO> getRelatedCourses(Course course, Long userId) {
        List<CourseResponseDTO> relatedCourses = new ArrayList<>(findCoursesByKeyword(course.getAuthor().getUsername()));
        Arrays.stream(course.getCourseName().split(" ")).forEach(word -> {
            relatedCourses.addAll(findCoursesByKeyword(word, userId));
        });
        course.getTags().forEach(tag -> {
            relatedCourses.addAll(findCoursesByKeyword(tag, userId));
        });

        return relatedCourses;
    }
}
