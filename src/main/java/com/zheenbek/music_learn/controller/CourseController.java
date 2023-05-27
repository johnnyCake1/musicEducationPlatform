package com.zheenbek.music_learn.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zheenbek.music_learn.dto.course.CourseDTO;
import com.zheenbek.music_learn.dto.course.CourseModuleDTO;
import com.zheenbek.music_learn.dto.course.CourseTopicDTO;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

//    @PostMapping("/create")
//    public ResponseEntity<String> createCourse(@RequestBody CourseDTO courseDTO) {
//        // Access the file data
//        // - promoVideo: MultipartFile
//        // - previewImage: MultipartFile
//
//        // Process the file data as needed
//
//        // Save the course and return a response
//
//        return ResponseEntity.ok("Course created successfully.");
//    }

    @PostMapping
    public ResponseEntity<String> createCourse(@RequestParam("promoVideo") MultipartFile promoVideo,
                                               @RequestParam("previewPicture") MultipartFile previewPicture,
                                               @RequestPart("contentDataFiles") MultipartFile[] topicContentFiles,
                                               @RequestParam String courseDataJson) throws JsonProcessingException {
        CourseDTO course = new ObjectMapper().readValue(courseDataJson, CourseDTO.class);
        try {
            course = courseService.saveCourse(course, promoVideo, previewPicture, topicContentFiles);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }

//        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
        return new ResponseEntity<>("Course is created successfully", HttpStatus.CREATED);
    }

    /**
     * Creates/updates a course. The course object must contain {@link CourseDTO#authorId}. <br><br>
     * If the course object also contains {@link CourseDTO#id} then it will update existing course. Also depending on the value of {@link CourseDTO#isPublished}, it will either publish the course or save as draft course with {@link CourseDTO#authorId} being {@link com.zheenbek.music_learn.dto.user.UserDTO} author <br><br>
     * Otherwise, with {@link CourseDTO#id} field being {@code null}, it will create a new course entity with {@link CourseDTO#isPublished} being false <br><br>
     *
     * @param course
     * @return
     */
    @PutMapping
    ResponseEntity<CourseDTO> createOrUpdateCourse(@RequestBody CourseDTO course) {
        CourseDTO createdDraft = courseService.createOrUpdateDraftCourseForUser(course);
        return new ResponseEntity<>(createdDraft, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(@RequestParam(required = false) Long authorId) {
        if (authorId == null) {
            return new ResponseEntity<>(courseService.getAllCourses(), HttpStatus.OK);
        }
        return new ResponseEntity<>(courseService.getAllCoursesByAuthorId(authorId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable("id") Long courseId) {
        return new ResponseEntity<>(courseService.getCourseById(courseId), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable("id") Long courseId) {
        courseService.deleteCourse(courseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/convert-to-draft")
    public ResponseEntity<CourseDTO> convertToDraft (@PathVariable("id") Long courseId) {
        CourseDTO updatedCourse = courseService.convertToDraft(courseId);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/{courseModuleId}")
    public ResponseEntity<Void> deleteCourseModule(@PathVariable("id") Long courseId, @PathVariable Long courseModuleId) {
        courseService.deleteCourseModule(courseId, courseModuleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}/{courseModuleId}/{topicId}")
    public ResponseEntity<Void> deleteCourseTopic(@PathVariable("id") Long courseId, @PathVariable Long courseModuleId, @PathVariable Long topicId) {
        courseService.deleteCourseTopic(courseId, courseModuleId, topicId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}/preview-picture")
    public ResponseEntity<FileSystemResource> getCoursePreviewPicture(@PathVariable Long id) {
        File file = courseService.getPreviewPictureByCourseId(id);
        return getFileSystemResourceResponseEntity(file);
    }

    @GetMapping("/{id}/course-video")
    public ResponseEntity<FileSystemResource> getCourseVideo(@PathVariable Long id) {
        File file = courseService.getCourseVideoByCourseId(id);
        return getFileSystemResourceResponseEntity(file);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getCourseReviews(@PathVariable Long id) {
        List<Review> reviews = courseService.getCourseReviews(id);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> addReview(@PathVariable Long id, @RequestBody Review review) {
        List<Review> updatedReviews = courseService.addReviewToCourse(id, review);
        return new ResponseEntity<>(updatedReviews, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/reviews/{reviewId}")
    public ResponseEntity<List<Review>> removeReview(@PathVariable Long id, @PathVariable Long reviewId) {
        List<Review> updatedReviews = courseService.removeReviewFromCourse(id, reviewId);
        return new ResponseEntity<>(updatedReviews, HttpStatus.OK);
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<Course> enrollUser(@PathVariable Long id, @RequestParam Long userId) {
        Course updatedCourse = courseService.enrollUser(id, userId);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    @PostMapping("/{id}/drop")
    public ResponseEntity<Course> dropUser(@PathVariable Long id, @RequestParam Long userId) {
        Course updatedCourse = courseService.dropUser(id, userId);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    @GetMapping("/draft-courses")
    public ResponseEntity<List<CourseDTO>> getAllDraftCoursesByAuthor(@RequestParam Long authorId) {
        List<CourseDTO> draftCourses = courseService.getAllDraftCoursesByAuthorId(authorId);
        return new ResponseEntity<>(draftCourses, HttpStatus.OK);
    }

    @PostMapping("/draft-courses/create-empty")
    ResponseEntity<CourseDTO> createOrUpdateDraftCourseForUser(@RequestParam Long authorId) {
        CourseDTO createdDraft = courseService.createEmptyDraftCourseForUser(authorId);
        return new ResponseEntity<>(createdDraft, HttpStatus.CREATED);
    }

    @PostMapping("/draft-courses/{draftCourseId}/create-empty-module")
    ResponseEntity<CourseModuleDTO> createEmptyModule(@PathVariable Long draftCourseId) {
        CourseModuleDTO createdModule = courseService.createEmptyModule(draftCourseId);
        return new ResponseEntity<>(createdModule, HttpStatus.CREATED);
    }

    @PostMapping("/draft-courses/{draftCourseId}/{moduleId}/create-empty-topic")
    ResponseEntity<CourseTopicDTO> createEmptyTopic(@PathVariable Long draftCourseId, @PathVariable Long moduleId) {
        CourseTopicDTO createdTopic = courseService.createEmptyTopic(draftCourseId, moduleId);
        return new ResponseEntity<>(createdTopic, HttpStatus.CREATED);
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<Course>> searchAllCoursesByKeyword(@PathVariable String keyword) {
        return new ResponseEntity<>(courseService.findCoursesByKeyword(keyword), HttpStatus.OK);
    }

    static ResponseEntity<FileSystemResource> getFileSystemResourceResponseEntity(File file) {
        FileSystemResource resource = new FileSystemResource(file);
        HttpHeaders headers = new HttpHeaders();
        try {
            headers.setContentType(MediaType.valueOf(Files.probeContentType(file.toPath())));
        } catch (IOException e) {
            //if content type is unknown, we just pray for the best...
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }

}
