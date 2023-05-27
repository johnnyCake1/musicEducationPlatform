package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.course.ContentDataDTO;
import com.zheenbek.music_learn.dto.course.CourseDTO;
import com.zheenbek.music_learn.dto.course.CourseModuleDTO;
import com.zheenbek.music_learn.dto.course.CourseTopicDTO;
import com.zheenbek.music_learn.entity.course.ContentData;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.course.CourseModule;
import com.zheenbek.music_learn.entity.course.CourseTopic;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.ContentDataRepository;
import com.zheenbek.music_learn.repository.CourseModuleRepository;
import com.zheenbek.music_learn.repository.CourseRepository;
import com.zheenbek.music_learn.repository.CourseTopicRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.ReviewRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;

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

    @Autowired
    public CourseService(CourseRepository courseRepository,
                         FileRepository fileRepository,
                         CourseTopicRepository courseTopicRepository,
                         CourseModuleRepository courseModuleRepository,
                         ServerFileStorageService serverFileStorageService,
                         UserRepository userRepository,
                         ReviewRepository reviewRepository,
                         ContentDataRepository contentDataRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.courseTopicRepository = courseTopicRepository;
        this.contentDataRepository = contentDataRepository;
        this.fileRepository = fileRepository;
        this.serverFileStorageService = serverFileStorageService;
        this.reviewRepository = reviewRepository;
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(this::mapCourseToDto).collect(Collectors.toList());
    }

    @Transactional
    public CourseDTO saveCourse(CourseDTO courseDTO, MultipartFile promoVideo, MultipartFile previewPicture, MultipartFile[] orderedTopicContentFiles) throws IOException {
        //convert CourseDTO to Course entity
        Course course = mapDtoToCourse(courseDTO);
        //create the files in the system and database and append to the entity
        //save in the system:
        File storedVideoFile = serverFileStorageService.storeCourseFile(promoVideo.getBytes(), promoVideo.getContentType(), course.getCourseName());
        File storedPictureFile = serverFileStorageService.storeCourseFile(previewPicture.getBytes(), previewPicture.getContentType(), course.getCourseName());
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
                        case FILE: {
                            MultipartFile topicContentFile = orderedTopicContentFiles[topicFileIndex++];
                            //save in the system:
                            File file = serverFileStorageService.storeCourseFile(topicContentFile.getBytes(), topicContentFile.getContentType(), topic.getTopicName());
                            //save in the database:
                            FileEntity fileEntity = fileRepository.save(fileEntityFromFile(file, topicContentFile.getContentType()));
                            //append:
                            topic.getContentData().setFile(fileEntity);
                            break;
                        }
                        case QUIZ:
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

    public CourseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
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
                //delete old file from the file system
                serverFileStorageService.deleteProfilePicture(contentData.getFile().getFileName());
                //delete old file from the database
                fileRepository.delete(contentData.getFile());
            }
            contentDataRepository.delete(courseTopicToDelete.getContentData());
        }
        courseTopicRepository.delete(courseTopicToDelete);
    }

    @Transactional
    public CourseDTO createEmptyDraftCourseForUser(Long authorId) {
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
    public CourseDTO createOrUpdateDraftCourseForUser(CourseDTO courseDTO) {
        if (courseDTO.getAuthorId() == null) {
            throw new EntityNotFoundException("trying to create/update course with no author");
        }
        User author = userRepository.findById(courseDTO.getAuthorId()).orElseThrow(() -> new EntityNotFoundException("Author user not found with ID: " + courseDTO.getAuthorId()));

        //if a course came with an id, then update else create
        if (courseDTO.getId() != null) {
            Course course = courseRepository.findById(courseDTO.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Course not found to update with ID: " + courseDTO.getId()));
            if (course.getAuthor() == null || Objects.equals(course.getAuthor().getId(), course.getId())) {
                throw new EntityNotFoundException("Course not found with ID" + courseDTO.getId() + " that has the user as author with ID: " + courseDTO.getAuthorId());
            }
            boolean oldPublishedStated = course.isPublished();
            //update course with given object
            Course updatedCourse = saveCourse(mapDtoToCourse(courseDTO));
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
        Course createdDraftCourse = saveCourse(mapDtoToCourse(courseDTO));
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
//                quizRepository.save(contentData.getQuiz());
            }
            contentDataRepository.save(contentData);
        }
        courseTopicRepository.save(courseTopic);
    }

    @Transactional
    public CourseDTO updateDraftCourseForUser(Long authorId, Long courseId, CourseDTO courseDTO) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author user not found with ID: " + authorId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Draft course not found with ID: " + courseId));
        if (author.getDraftCourses().contains(course)) {
            Course updatedCourse = courseRepository.save(mapDtoToCourse(courseDTO));
            return mapCourseToDto(updatedCourse);
        }
        return courseDTO;
    }

    public List<CourseDTO> getAllDraftCoursesByAuthorId(Long userId) {
        List<Course> courses = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getDraftCourses();
        return courses.stream().map(this::mapCourseToDto).collect(Collectors.toList());
    }

    public List<CourseDTO> getAllCoursesByAuthorId(Long authorId) {
        return courseRepository.findAllByAuthorId(authorId).stream().map(this::mapCourseToDto).collect(Collectors.toList());
    }

    public List<Course> findCoursesByKeyword(String keyword) {
        return courseRepository.searchCoursesByKeyword(keyword);
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

    public CourseDTO convertToDraft(Long courseId) {
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
    public Course enrollUser(Long courseId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        if (!user.getTakenCourses().contains(course)) {
            user.getTakenCourses().add(course);
            userRepository.save(user);
        }
        if (!course.getEnrolledStudents().contains(user)) {
            course.getEnrolledStudents().add(user);
            courseRepository.save(course);
        }
        return course;
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

    private Course mapDtoToCourse(CourseDTO courseDTO) {
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
            contentData.setQuiz(contentDataDTO.getQuiz());
        }
        if (contentDataDTO.getFileId() != null) {
            contentData.setFile(fileRepository.findById(contentDataDTO.getFileId()).orElseThrow(() -> new EntityNotFoundException("Content data file entity not found with ID: " + contentDataDTO.getFileId())));
        }
        return contentData;
    }

    private CourseDTO mapCourseToDto(Course course) {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(course.getId());
        courseDTO.setCourseLongDescription(course.getCourseLongDescription());
        courseDTO.setCourseName(course.getCourseName());
        courseDTO.setPrice(course.getPrice());
        courseDTO.setCourseShortDescription(course.getCourseShortDescription());
        courseDTO.setWhatYouWillLearn(course.getWhatYouWillLearn());
        courseDTO.setRequirements(course.getRequirements());
        courseDTO.setTags(course.getTags());
        courseDTO.setReviews(course.getReviews());
        courseDTO.setCreationDate(course.getCreationDate());
        courseDTO.setLastUpdatedDate(course.getLastUpdatedDate());
        courseDTO.setPublished(course.isPublished());
        if (course.getPreviewImage() != null) {
            courseDTO.setPreviewImageId(course.getPreviewImage().getId());
        }
        if (course.getPromoVideo() != null) {
            courseDTO.setPromoVideoId(course.getPromoVideo().getId());
        }
        if (course.getAuthor() != null) {
            courseDTO.setAuthorId(course.getAuthor().getId());
        }
        if (course.getEnrolledStudents() != null) {
            courseDTO.setEnrolledStudentsIds(course.getEnrolledStudents().stream().map(User::getId).collect(Collectors.toList()));
        }
        if (course.getCurriculum() != null) {
            courseDTO.setCurriculum(course.getCurriculum().stream().map(this::mapCourseModuleToDto).collect(Collectors.toList()));
        }
        return courseDTO;
    }

    private CourseModuleDTO mapCourseModuleToDto(CourseModule courseModule) {
        CourseModuleDTO courseModuleDTO = new CourseModuleDTO();
        courseModuleDTO.setId(courseModule.getId());
        courseModuleDTO.setModuleName(courseModule.getModuleName());
        if (courseModule.getCourseTopics() != null) {
            courseModuleDTO.setCourseTopics(courseModule.getCourseTopics().stream().map(this::mapCourseTopicToDto).collect(Collectors.toList()));
        }
        return courseModuleDTO;
    }

    private CourseTopicDTO mapCourseTopicToDto(CourseTopic courseTopic) {
        CourseTopicDTO courseTopicDTO = new CourseTopicDTO();
        courseTopicDTO.setId(courseTopic.getId());
        courseTopicDTO.setTopicName(courseTopic.getTopicName());
        if (courseTopic.getContentData() != null) {
            courseTopicDTO.setContentData(mapContentDataToDto(courseTopic.getContentData()));
        }
        return courseTopicDTO;
    }

    private ContentDataDTO mapContentDataToDto(ContentData contentData) {
        ContentDataDTO contentDataDTO = new ContentDataDTO();
        contentDataDTO.setId(contentData.getId());
        contentDataDTO.setContentType(contentData.getContentType());
        if (contentData.getFile() != null) {
            contentDataDTO.setFileId(contentData.getFile().getId());
        }
        if (contentData.getQuiz() != null && contentData.getQuiz().size() > 0) {
            contentDataDTO.setQuiz(contentData.getQuiz());
        }
        return contentDataDTO;
    }
}
