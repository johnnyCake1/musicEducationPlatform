package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.UserDTO;
import com.zheenbek.music_learn.entity.Course;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.CourseRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.ReviewRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final FileRepository fileRepository;
    private final ReviewRepository reviewRepository;

    private final ServerFileStorageService serverFileStorageService;

    @Autowired
    public UserService(UserRepository userRepository, FileRepository fileRepository, ServerFileStorageService serverFileStorageService, CourseRepository courseRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.serverFileStorageService = serverFileStorageService;
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public Optional<UserDTO> findById(Long userId) {
        return userRepository.findById(userId).map(UserService::convertToUserDTO);
    }

    public void deleteUserProfilePic(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        FileEntity file = user.getProfilePic();

        if (file == null) {
            throw new RuntimeException("Profile picture not found for user with ID " + userId);
        }
        serverFileStorageService.deleteProfilePicture(file.getFileName());
        fileRepository.delete(file);
    }

    @Transactional
    public UserDTO addSavedCourse(Long userId, Long courseId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        user.getSavedCourses().add(course);
        return convertToUserDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO deleteSavedCourse(Long userId, Long courseId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        user.getSavedCourses().removeIf(c -> c.getId().equals(courseId));
        return convertToUserDTO(userRepository.save(user));
    }

    @Transactional
    public List<Course> getAllTakenCourses(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getTakenCourses();
    }

    @Transactional
    public List<Course> getAllSavedCourses(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getSavedCourses();
    }

    @Transactional
    public List<Course> getAllPublishedCourses(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getPublishedCourses();
    }

    public String getUsername(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getUsername();
    }

    public List<Review> getUserReviews(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)).getReviews();
    }

    public List<Review> addReviewToUser(Long userId, Review review) {
        Review newReview = reviewRepository.save(review);
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        user.getReviews().add(newReview);
        return userRepository.save(user).getReviews();
    }

    public List<UserDTO> findUsersByKeyword(String keyword) {
        return userRepository.searchUsersByKeyword(keyword).stream().map(UserService::convertToUserDTO).collect(Collectors.toList());
    }

    @Transactional
    public UserDTO followUser(Long userId, Long userIdToFollow) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        User userToFollow = userRepository.findById(userIdToFollow).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userIdToFollow));
        if (!userToFollow.getFollowers().contains(user)) {
            userToFollow.getFollowers().add(user);
            userRepository.save(userToFollow);
        }
        if (!user.getFollowings().contains(userToFollow)) {
            user.getFollowings().add(userToFollow);
            userRepository.save(user);
        }
        return convertToUserDTO(user);
    }

    public UserDTO unfollowUser(Long userId, Long userIdToUnfollow) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        User userToUnfollow = userRepository.findById(userIdToUnfollow).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userIdToUnfollow));
        if (userToUnfollow.getFollowers().contains(user)) {
            userToUnfollow.getFollowers().remove(user);
            userRepository.save(userToUnfollow);
        }
        if (user.getFollowings().contains(userToUnfollow)) {
            user.getFollowings().remove(userToUnfollow);
            userRepository.save(user);
        }
        return convertToUserDTO(user);
    }

    public static UserDTO convertToUserDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setStartDate(user.getStartDate());
        userDTO.setAboutMe(user.getAboutMe());
        userDTO.setTags(user.getTags());
        userDTO.setFollowersIds(user.getFollowers().stream().map(User::getId).collect(Collectors.toList()));
        userDTO.setFollowingsIds(user.getFollowings().stream().map(User::getId).collect(Collectors.toList()));
        userDTO.setPublishedCoursesIds(user.getPublishedCourses().stream().map(Course::getId).collect(Collectors.toList()));
        userDTO.setTakenCoursesIds(user.getTakenCourses().stream().map(Course::getId).collect(Collectors.toList()));
        userDTO.setSavedCoursesIds(user.getSavedCourses().stream().map(Course::getId).collect(Collectors.toList()));
//        userDTO.setAuthorities(user.getAuthorities()); //this is causing cyclic relationship
        return userDTO;
    }
}
