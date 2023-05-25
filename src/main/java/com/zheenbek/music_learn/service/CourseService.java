package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.ContentDataDTO;
import com.zheenbek.music_learn.dto.CourseDTO;
import com.zheenbek.music_learn.dto.CourseModuleDTO;
import com.zheenbek.music_learn.dto.CourseTopicDTO;
import com.zheenbek.music_learn.entity.ContentData;
import com.zheenbek.music_learn.entity.Course;
import com.zheenbek.music_learn.entity.CourseModule;
import com.zheenbek.music_learn.entity.CourseTopic;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.User;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    @Transactional
    public Course createCourse(CourseDTO courseDTO, MultipartFile promoVideo, MultipartFile previewPicture, MultipartFile[] orderedTopicContentFiles) throws IOException {
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
                        }
                        case QUIZ:{

                        }
                        case UNKNOWN:{

                        }
                        default: {
                            topic.getContentData().setContentType(ContentData.ContentType.UNKNOWN);
                        }
                    }
                    contentDataRepository.save(topic.getContentData());
                }
                courseTopicRepository.save(topic);
            }
            courseModuleRepository.save(module);
        }

        //finally save the course
        return courseRepository.save(course);
    }

    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }

    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getAllCoursesByAuthorId(Long authorId) {
        return courseRepository.findAllByAuthorId(authorId);
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

    @Transactional
    public Course enrollStudent(Long courseId, Long userId) {
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
        course.setAuthor(userRepository.findById(courseDTO.getAuthorId()).orElseThrow(() -> new EntityNotFoundException("Course author not found with ID: " + courseDTO.getAuthorId())));
        course.setEnrolledStudents(courseDTO.getEnrolledStudentsIds().stream().map(id -> userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Course student not found with ID: " + id))).collect(Collectors.toList()));
        course.setCurriculum(courseDTO.getCurriculum().stream().map(this::mapDtoToCourseModule).collect(Collectors.toList()));
        return course;
    }

    private CourseModule mapDtoToCourseModule(CourseModuleDTO courseModuleDTO) {
        CourseModule courseModule = new CourseModule();
        courseModule.setModuleName(courseModuleDTO.getModuleName());
        courseModule.setCourseTopics(courseModuleDTO.getCourseTopics().stream().map(this::mapDtoToCourseTopic).collect(Collectors.toList()));
        return courseModule;
    }

    private CourseTopic mapDtoToCourseTopic(CourseTopicDTO courseTopicDTO) {
        CourseTopic courseTopic = new CourseTopic();
        courseTopic.setTopicName(courseTopicDTO.getTopicName());
        courseTopic.setContentData(mapDtoToCourseData(courseTopicDTO.getContentData()));
        return courseTopic;
    }

    private ContentData mapDtoToCourseData(ContentDataDTO contentDataDTO) {
        ContentData contentData = new ContentData();
        contentData.setContentType(contentDataDTO.getContentType());
        return contentData;
    }
}
