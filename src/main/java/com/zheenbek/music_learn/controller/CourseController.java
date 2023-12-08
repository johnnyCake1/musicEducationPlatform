package com.zheenbek.music_learn.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zheenbek.music_learn.config.JwtUtil;
import com.zheenbek.music_learn.dto.request.course.CourseRequestDTO;
import com.zheenbek.music_learn.dto.response.course.CategoryResponseDTO;
import com.zheenbek.music_learn.dto.response.course.CourseResponseDTO;
import com.zheenbek.music_learn.dto.request_response.course.CourseModuleDTO;
import com.zheenbek.music_learn.dto.request_response.course.CourseTopicDTO;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.service.CourseService;
import com.zheenbek.music_learn.service.PurchaseRecordService;
import com.zheenbek.music_learn.service.StripeService;
import com.zheenbek.music_learn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    private final CourseService courseService;
    private final UserService userService;
    private final StripeService stripeService;
    private final PurchaseRecordService purchaseService;
    private final JwtUtil jwtUtil;
    @Autowired
    public CourseController(CourseService courseService,
                            UserService userService,
                            StripeService stripeService,
                            PurchaseRecordService purchaseService,
                            JwtUtil jwtUtil) {
        this.courseService = courseService;
        this.userService = userService;
        this.stripeService = stripeService;
        this.purchaseService = purchaseService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/recommendations") // must be authorised
    public ResponseEntity<List<CourseResponseDTO>> getRecommendedCoursesForUser(@RequestParam Long userId) {
        List<CourseResponseDTO> foundCourses = courseService.getRecommendedCoursesForUser(userId);
        System.out.println("recommendation result size: " + foundCourses.size());
        return new ResponseEntity<>(foundCourses, HttpStatus.OK);
    }

    @PostMapping // must be authorised
    public ResponseEntity<CourseResponseDTO> createCourse(@RequestParam("promoVideo") MultipartFile promoVideo,
                                                          @RequestParam("previewPicture") MultipartFile previewPicture,
                                                          @RequestPart("contentDataFiles") MultipartFile[] topicContentFiles,
                                                          @RequestParam String courseDataJson) throws JsonProcessingException {
        CourseRequestDTO request = new ObjectMapper().readValue(courseDataJson, CourseRequestDTO.class);
        CourseResponseDTO response;

        try {
            response = courseService.createCourse(request, promoVideo, previewPicture, topicContentFiles);
        } catch (IOException e) {
            throw new RuntimeException("Couldn't create the course: " + e);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Creates/updates a course. The course object must contain {@link CourseResponseDTO#authorId}. <br><br>
     * If the course object also contains {@link CourseResponseDTO#id} then it will update existing course. Also depending on the value of {@link CourseResponseDTO#isPublished}, it will either publish the course or save as draft course with {@link CourseResponseDTO#authorId} being {@link com.zheenbek.music_learn.dto.request_response.user.UserDTO} author <br><br>
     * Otherwise, with {@link CourseResponseDTO#id} field being {@code null}, it will create a new course entity with {@link CourseResponseDTO#isPublished} being false <br><br>
     *
     * @param course course object that will replace the actual course info
     * @return updated course
     */
    @PutMapping // must be authorised
    ResponseEntity<CourseResponseDTO> createOrUpdateCourse(@RequestBody CourseRequestDTO course) {
        CourseResponseDTO createdDraft = courseService.createOrUpdateDraftCourseForUser(course);
        return new ResponseEntity<>(createdDraft, HttpStatus.CREATED);
    }

    @GetMapping // can be unauthorised
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses(@RequestParam(required = false) Long authorId) {
        if (authorId == null) {
            return new ResponseEntity<>(courseService.getAllCourses(true), HttpStatus.OK);
        }
        return new ResponseEntity<>(courseService.getAllCoursesByAuthorId(authorId, true), HttpStatus.OK);
    }

    @GetMapping ("/filter")
    public ResponseEntity<List<CourseResponseDTO>> getAllCoursesByFiltering(@RequestParam(required = false, defaultValue = "false") Boolean mostEnrollment, @RequestParam(required = false, defaultValue = "10") Integer limit) {
        List<CourseResponseDTO> result = courseService.getAllCoursesByFiltering(mostEnrollment, limit);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}") // can be unauthorised
    public ResponseEntity<CourseResponseDTO> getCourse(@PathVariable("id") Long courseId,
                                                       @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        CourseResponseDTO courseNoContentResponseDTO = courseService.getCourseById(courseId, false);
        // Extract the JWT token from the Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            String username = jwtUtil.extractUsername(jwtToken);
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));
            if (courseNoContentResponseDTO.getAuthor().getId().equals(user.getId()) || courseNoContentResponseDTO.getEnrolledStudentsIds().contains(user.getId())) {
                // if user is authenticated and is author or just enrolled then show full content:
                return new ResponseEntity<>(courseService.getCourseById(courseId, true), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(courseNoContentResponseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}") // must be authorised
    public ResponseEntity<Void> deleteCourse(@PathVariable("id") Long courseId) {
        courseService.deleteCourse(courseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/convert-to-draft") // must be authorised
    public ResponseEntity<CourseResponseDTO> convertToDraft(@PathVariable("id") Long courseId) {
        CourseResponseDTO updatedCourse = courseService.convertToDraft(courseId);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/{courseModuleId}") // must be authorised
    public ResponseEntity<Void> deleteCourseModule(@PathVariable("id") Long courseId, @PathVariable Long courseModuleId) {
        courseService.deleteCourseModule(courseId, courseModuleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}/{courseModuleId}/{topicId}") // must be authorised
    public ResponseEntity<Void> deleteCourseTopic(@PathVariable("id") Long courseId, @PathVariable Long courseModuleId, @PathVariable Long topicId) {
        courseService.deleteCourseTopic(courseId, courseModuleId, topicId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}/reviews") // can be unauthorised
    public ResponseEntity<List<Review>> getCourseReviews(@PathVariable Long id) {
        List<Review> reviews = courseService.getCourseReviews(id);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping("/{id}/reviews") // must be authorised
    public ResponseEntity<List<Review>> addReview(@PathVariable Long id, @RequestBody Review review) {
        List<Review> updatedReviews = courseService.addReviewToCourse(id, review);
        return new ResponseEntity<>(updatedReviews, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/reviews/{reviewId}") // must be authorised
    public ResponseEntity<List<Review>> removeReview(@PathVariable Long id, @PathVariable Long reviewId) {
        List<Review> updatedReviews = courseService.removeReviewFromCourse(id, reviewId);
        return new ResponseEntity<>(updatedReviews, HttpStatus.OK);
    }

    @PostMapping("/{id}/enroll") // must be authorised
    public ResponseEntity<CourseResponseDTO> enrollUser(@PathVariable Long id,
                                                        @RequestParam Long userId,
                                                        @RequestHeader(value = "token", required = false, defaultValue = "") final String token,
                                                        @RequestHeader(value = "amount", required = false, defaultValue = "0.0") final Float amount) {
        System.out.println("ENROLLMENT INITIATED: userid: " + userId + " courseid:" + id + " token: " + token + " amount: " + amount);
        Course course = courseService.findCourseById(id);
        User user = userService.getUserById(userId);
        System.out.println("Course price:" + course.getPrice() + " paid amount:" + amount);
        if (course.getPrice() > 0) {
            if (token == null || token.isEmpty()) {
                throw new RuntimeException(String.format("Can't enroll user with ID %s to course with ID %s : Invalid stripe token", userId, id));
            }
            if (amount > course.getPrice()) {
                throw new RuntimeException(String.format("Can't enroll user with ID %s to course with ID %s : Payment amount is greater than the actual course price. Amount paid: %s, Actual price: %s", userId, id, amount, course.getPrice()));
            }
            if (amount < course.getPrice()) {
                throw new RuntimeException(String.format("Can't enroll user with ID %s to course with ID %s : Payment amount is less than the actual course price. Amount paid: %s, Actual price: %s", userId, id, amount, course.getPrice()));
            }
            if (Objects.equals(course.getAuthor().getId(), user.getId())){
                throw new RuntimeException(String.format("Can't enroll user with ID %s to course with ID %s : The author cannot enroll to his own course", userId, id));
            }
            try {
                stripeService.chargeNewCard(token, amount);
                purchaseService.recordCoursePurchase(user, course, amount, new Date());
            } catch (Exception e) {
                throw new RuntimeException(String.format("Can't enroll user with ID %s to course with ID %s : charging the card failed: %s", userId, id, e));
            }
        }
        System.out.println("Before RETURNING");
        CourseResponseDTO result = courseService.enrollUser(course, user);
        System.out.println("RETURNING " + result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/{id}/drop") // must be authorised
    public ResponseEntity<Course> dropUser(@PathVariable Long id, @RequestParam Long userId) {
        Course updatedCourse = courseService.dropUser(id, userId);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    @GetMapping("/categories") // can be unauthorised
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<CategoryResponseDTO> categories = courseService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/categories/{categoryId}") // can be unauthorised
    public ResponseEntity<CategoryResponseDTO> getCategory(@PathVariable Long categoryId) {
        CategoryResponseDTO category = courseService.getCategoryById(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @GetMapping("/categories/{categoryId}/get-courses") // can be unauthorised
    public ResponseEntity<List<CourseResponseDTO>> getCoursesByCategory(@PathVariable Long categoryId) {
        List<CourseResponseDTO> foundCourses = courseService.getAllCoursesByCategory(categoryId);
        return new ResponseEntity<>(foundCourses, HttpStatus.OK);
    }

    @GetMapping("/draft-courses") // must be authorised
    public ResponseEntity<List<CourseResponseDTO>> getAllDraftCoursesByAuthor(@RequestParam Long authorId) {
        List<CourseResponseDTO> draftCourses = courseService.getAllDraftCoursesByAuthorId(authorId);
        return new ResponseEntity<>(draftCourses, HttpStatus.OK);
    }

    @PostMapping("/draft-courses/create-empty") // must be authorised
    ResponseEntity<CourseResponseDTO> createOrUpdateDraftCourseForUser(@RequestParam Long authorId) {
        CourseResponseDTO createdDraft = courseService.createEmptyDraftCourseForUser(authorId);
        return new ResponseEntity<>(createdDraft, HttpStatus.CREATED);
    }

    @PostMapping("/draft-courses/{draftCourseId}/create-empty-module") // must be authorised
    ResponseEntity<CourseModuleDTO> createEmptyModule(@PathVariable Long draftCourseId) {
        CourseModuleDTO createdModule = courseService.createEmptyModule(draftCourseId);
        return new ResponseEntity<>(createdModule, HttpStatus.CREATED);
    }

    @PostMapping("/draft-courses/{draftCourseId}/{moduleId}/create-empty-topic") // must be authorised
    ResponseEntity<CourseTopicDTO> createEmptyTopic(@PathVariable Long draftCourseId, @PathVariable Long moduleId) {
        CourseTopicDTO createdTopic = courseService.createEmptyTopic(draftCourseId, moduleId);
        return new ResponseEntity<>(createdTopic, HttpStatus.CREATED);
    }

    @GetMapping("/search/{keyword}") // can be unauthorised
    public ResponseEntity<List<CourseResponseDTO>> searchAllCoursesByKeyword(@PathVariable String keyword) {
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
