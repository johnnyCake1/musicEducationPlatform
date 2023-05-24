package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.UserDTO;
import com.zheenbek.music_learn.entity.Course;
import com.zheenbek.music_learn.entity.CourseModule;
import com.zheenbek.music_learn.entity.CourseTopic;
//import com.zheenbek.music_learn.entity.DisplayableContent;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.CourseModuleRepository;
import com.zheenbek.music_learn.repository.CourseRepository;
import com.zheenbek.music_learn.repository.CourseTopicRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.ReviewRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

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

    @Autowired
    public CourseService(CourseRepository courseRepository, FileRepository fileRepository,
                         CourseTopicRepository courseTopicRepository, CourseModuleRepository courseModuleRepository,
                         ServerFileStorageService serverFileStorageService, UserRepository userRepository,
                         ReviewRepository reviewRepository) {
        this.courseRepository = courseRepository;
        this.fileRepository = fileRepository;
        this.courseTopicRepository = courseTopicRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.serverFileStorageService = serverFileStorageService;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    public Course createCourse(Course course, MultipartFile courseVideo, MultipartFile coursePicture) throws IOException {
        List<CourseModule> courseModules = new ArrayList<>();
        if (course.getCurriculum() != null) {
            for (CourseModule module : course.getCurriculum()) {
                List<CourseTopic> courseTopics = new ArrayList<>();
                if (module.getCourseTopics() != null) {
                    for (CourseTopic topic : module.getCourseTopics()) {
                        //create a topic and it to courseTopics list
                        courseTopics.add(courseTopicRepository.save(topic));
                    }
                }
                //attach created topics list to the module
                module.setCourseTopics(courseTopics);
                courseModules.add(courseModuleRepository.save(module));
            }
        }
        //attach created modules to the course
        course.setCurriculum(courseModules);
        //set date fields
        course.setCreationDate(new Date());
        course.setLastUpdatedDate(new Date());
        //save course's video courseVideo & coursePicture in the courseVideo system
        File storedVideoFile = serverFileStorageService.storeCourseFile(courseVideo.getBytes(), courseVideo.getContentType(), course.getCourseName());
        File storedPictureFile = serverFileStorageService.storeCourseFile(coursePicture.getBytes(), coursePicture.getContentType(), course.getCourseName());
        //save course's video courseVideo & coursePicture in the database
        FileEntity courseVideoEntity = fileRepository.save(fileEntityFromFile(storedVideoFile, courseVideo.getContentType()));
        FileEntity coursePictureEntity = fileRepository.save(fileEntityFromFile(storedPictureFile, coursePicture.getContentType()));
        //attach the course's attached video & picture to the course itself
        course.setPromoVideo(courseVideoEntity);
        course.setPreviewImage(coursePictureEntity);
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
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
        if (course.getPreviewImage() == null) {
            return null;
        }
        return new File(course.getPreviewImage().getFilePath());
    }

    public File getCourseVideoByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
        if (course.getPromoVideo() == null) {
            return null;
        }
        return new File(course.getPromoVideo().getFilePath());
    }

    public List<Review> getCourseReviews(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
        return course.getReviews();
    }

    @Transactional
    public Course enrollStudent(Long courseId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
        user.getTakenCourses().remove(course);
        userRepository.save(user);
        course.getEnrolledStudents().remove(user);
        courseRepository.save(course);
        return course;
    }

    @Transactional
    public List<Review> addReviewToCourse(Long courseId, Review review) {
        Review newReview = reviewRepository.save(review);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
        course.getReviews().add(newReview);
        return courseRepository.save(course).getReviews();
    }

    @Transactional
    public List<Review> removeReviewFromCourse(Long courseId, Long reviewId) {
        Review reviewToDelete = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NoSuchElementException("Review not found with ID: " + reviewId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseId));
        course.getReviews().remove(reviewToDelete);
        List <Review> updatedReviews = courseRepository.save(course).getReviews();
        reviewRepository.delete(reviewToDelete);
        return updatedReviews;
    }
}
