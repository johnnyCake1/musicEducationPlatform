package com.zheenbek.music_learn.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zheenbek.music_learn.dto.UserDTO;
import com.zheenbek.music_learn.entity.Course;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Course> createCourseWithFile(@RequestParam("file") MultipartFile file, @RequestParam("picture") MultipartFile picture, @RequestParam("course") String courseJson) throws IOException {
        Course course = new ObjectMapper().readValue(courseJson, Course.class);
        Course createdCourse = courseService.createCourse(course, file, picture);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<Course>> searchAllCoursesByKeyword(@PathVariable String keyword) {
        return new ResponseEntity<>(courseService.findCoursesByKeyword(keyword), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCoursesByAuthorId(@RequestParam Long authorId) {
        return new ResponseEntity<>(courseService.getAllCoursesByAuthorId(authorId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable("id") Long courseId) {
        return courseService.getCourseById(courseId).map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable("id") Long courseId) {
        courseService.deleteCourse(courseId);
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

    @PostMapping("/{id}/enroll")
    public ResponseEntity<UserDTO> enrollUser(@PathVariable Long id, @RequestParam Long userId) {
        UserDTO enrolledUser = courseService.enrollStudent(id, userId);
        return new ResponseEntity<>(enrolledUser, HttpStatus.OK);
    }

    @PostMapping("/{id}/drop")
    public ResponseEntity<UserDTO> dropUser(@PathVariable Long id, @RequestParam Long userId) {
        UserDTO droppedUser = courseService.dropUser(id, userId);
        return new ResponseEntity<>(droppedUser, HttpStatus.OK);
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
