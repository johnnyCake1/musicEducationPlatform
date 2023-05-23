package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.UserDTO;
import com.zheenbek.music_learn.entity.Course;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.service.FileService;
import com.zheenbek.music_learn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.zheenbek.music_learn.controller.CourseController.getFileSystemResourceResponseEntity;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final FileService fileService;

    @Autowired
    public UserController(UserService userService, FileService fileService) {
        this.userService = userService;
        this.fileService = fileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        Optional<UserDTO> user = userService.findById(userId);
        return user.map(userDTO -> new ResponseEntity<>(userDTO, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<UserDTO> followUserById(@PathVariable Long userId, @RequestParam Long userIdToFollow) {
        UserDTO updatedUser = userService.followUser(userId, userIdToFollow);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PostMapping("/{userId}/unfollow")
    public ResponseEntity<UserDTO> unfollowUserById(@PathVariable Long userId, @RequestParam Long userIdToUnfollow) {
        UserDTO updatedUser = userService.unfollowUser(userId, userIdToUnfollow);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/{userId}/profile-picture")
    public ResponseEntity<FileSystemResource> getProfilePicture(@PathVariable Long userId) {
        File file = fileService.getProfilePictureByUserId(userId);
        return getFileSystemResourceResponseEntity(file);
    }

    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestBody byte[] fileData, @RequestHeader("Content-Type") String contentType, @PathVariable Long userId) {
        if (fileData == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("file is missing in file upload request");
        }
        if (!Objects.equals(contentType, MediaType.IMAGE_JPEG_VALUE) || !Objects.equals(contentType, MediaType.IMAGE_PNG_VALUE)) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("not supported file type for the profile picture");
        }
        try {
            fileService.saveProfilePicture(userId, fileData, contentType);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("failed to save the profile picture.");
        }
        return ResponseEntity.ok("Profile picture is successfully uploaded");
    }

    @DeleteMapping("/{userId}/profile-picture")
    public ResponseEntity<String> deleteProfilePic(@PathVariable Long userId) {
        userService.deleteUserProfilePic(userId);
        return ResponseEntity.ok().body("deleted successfully");
    }

    @PostMapping("/{userId}/saved-courses/{courseId}")
    public ResponseEntity<UserDTO> addSavedCourse(@PathVariable Long userId, @PathVariable Long courseId) {
        UserDTO updatedUser = userService.addSavedCourse(userId, courseId);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/saved-courses/{courseId}")
    public ResponseEntity<UserDTO> deleteSavedCourse(@PathVariable Long userId, @PathVariable Long courseId) {
        UserDTO updatedUser = userService.deleteSavedCourse(userId, courseId);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/{userId}/taken-courses")
    public ResponseEntity<List<Course>> getAllTakenCourses(@PathVariable Long userId) {
        List<Course> takenCourses = userService.getAllTakenCourses(userId);
        return new ResponseEntity<>(takenCourses, HttpStatus.OK);
    }

    @GetMapping("/{userId}/saved-courses")
    public ResponseEntity<List<Course>> getAllSavedCourses(@PathVariable Long userId) {
        List<Course> savedCourses = userService.getAllSavedCourses(userId);
        return new ResponseEntity<>(savedCourses, HttpStatus.OK);
    }

    @GetMapping("/{userId}/published-courses")
    public ResponseEntity<List<Course>> getAllPublishedCourses(@PathVariable Long userId) {
        List<Course> savedCourses = userService.getAllPublishedCourses(userId);
        return new ResponseEntity<>(savedCourses, HttpStatus.OK);
    }

    @GetMapping("/{userId}/username")
    public ResponseEntity<String> getUsername(@PathVariable Long userId) {
        return new ResponseEntity<>(userService.getUsername(userId), HttpStatus.OK);
    }

    @GetMapping("/{userId}/reviews")
    public ResponseEntity<List<Review>> getReviewsOfTheUser(@PathVariable Long userId) {
        return new ResponseEntity<>(userService.getUserReviews(userId), HttpStatus.OK);
    }

    @PostMapping("/{userId}/reviews")
    public ResponseEntity<List<Review>> addReview(@PathVariable Long userId, @RequestBody Review review) {
        List<Review> updatedReviews = userService.addReviewToUser(userId, review);
        return new ResponseEntity<>(updatedReviews, HttpStatus.OK);
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<UserDTO>> searchAllUsersByKeyword(@PathVariable String keyword) {
        return new ResponseEntity<>(userService.findUsersByKeyword(keyword), HttpStatus.OK);
    }
}
