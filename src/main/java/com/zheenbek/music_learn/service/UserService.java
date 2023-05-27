package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.user.UserDTO;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.user.Role;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.CourseRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.ReviewRepository;
import com.zheenbek.music_learn.repository.RoleRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.zheenbek.music_learn.service.FileService.FILES_SERVING_ENDPOINT;
import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CourseRepository courseRepository;
    private final FileRepository fileRepository;
    private final ReviewRepository reviewRepository;
    private final ServerFileStorageService serverFileStorageService;

    @Autowired
    public UserService(UserRepository userRepository, FileRepository fileRepository, ServerFileStorageService serverFileStorageService, CourseRepository courseRepository, ReviewRepository reviewRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.serverFileStorageService = serverFileStorageService;
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
        this.roleRepository = roleRepository;
    }

    public UserDTO createNewUser(String username, String password) {
        User newUser = new User();
        newUser.setUsername(username);
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        newUser.setPassword(encoder.encode(password));
        newUser.setStartDate(new Date());

        User createdUser = userRepository.save(newUser);
        Role userRole = new Role("ROLE_USER");
        userRole.setUser(createdUser);
        roleRepository.save(userRole);
        return mapUserToDto(createdUser);
    }

    public UserDTO updateUserInfo(Long userId, UserDTO userInfo) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        if (userInfo.getAboutMe() != null) {
            user.setAboutMe(userInfo.getAboutMe());
        }
        if (userInfo.getFirstName() != null) {
            user.setFirstName(userInfo.getFirstName());
        }
        if (userInfo.getLastName() != null) {
            user.setLastName(userInfo.getLastName());
        }
        if (userInfo.getTags() != null) {
            user.setTags(user.getTags());
        }
        return mapUserToDto(userRepository.save(user));
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserService::mapUserToDto).collect(Collectors.toList());
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public Optional<UserDTO> findById(Long userId) {
        return userRepository.findById(userId).map(UserService::mapUserToDto);
    }

    public Optional<File> getProfilePictureByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        if (user.getProfilePic() == null) {
            return Optional.empty();
        }
        return Optional.of(new File(user.getProfilePic().getFilePath()));
    }

    public File updateUserProfilePicture(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        FileEntity oldProfilePic = user.getProfilePic();
        //save new file in the file system
        File storedPicture = serverFileStorageService.storeFile(file, user.getUsername());
        //save new file in the database
        FileEntity newProfilePic = fileRepository.save(fileEntityFromFile(storedPicture, file.getContentType()));
        //update user
        user.setProfilePic(newProfilePic);
        userRepository.save(user);
        if (oldProfilePic != null) {
            //delete old profile picture from the file system
            serverFileStorageService.deleteProfilePicture(oldProfilePic.getFileName());
            //delete old profile picture from the database
            fileRepository.delete(oldProfilePic);
        }
        return storedPicture;
    }

    public void deleteUserProfilePic(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        if (user.getProfilePic() == null) {
            return;
        }
        FileEntity oldProfilePic = user.getProfilePic();
        //update user
        user.setProfilePic(null);
        userRepository.save(user);
        //delete old profile picture from the file system
        serverFileStorageService.deleteProfilePicture(oldProfilePic.getFileName());
        //delete old profile picture from the database
        fileRepository.delete(oldProfilePic);
    }

    public File addStoredFile(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        //save new file in the file system
        File storedPicture = serverFileStorageService.storeFile(file, user.getUsername());
        //save new file in the database
        FileEntity savedFile = fileRepository.save(fileEntityFromFile(storedPicture, file.getContentType()));
        //update user
        user.getStoredFiles().add(savedFile);
        userRepository.save(user);
        return storedPicture;
    }

    @Transactional
    public Optional<File> getUserStoredFile(Long userId, Long fileId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        FileEntity fileEntity = user.getStoredFiles()
                .stream()
                .filter(file -> Objects.equals(file.getId(), fileId))
                .findFirst()
                .orElse(null);

        if (fileEntity == null) {
            return Optional.empty();
        }
        return Optional.of(new File(fileEntity.getFilePath()));
    }

    @Transactional
    public UserDTO deleteUserStoredFile(Long userId, Long fileId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        FileEntity fileEntityToDelete = user.getStoredFiles()
                .stream()
                .filter(file -> Objects.equals(file.getId(), fileId))
                .findFirst()
                .orElse(null);
        FileEntity oldProfilePic = user.getProfilePic();
        if (fileEntityToDelete == null) {
            return mapUserToDto(user);
        }
        //update user
        user.getStoredFiles().remove(fileEntityToDelete);
        userRepository.save(user);
        //delete file from the file system
        serverFileStorageService.deleteProfilePicture(fileEntityToDelete.getFileName());
        //delete file from the database
        fileRepository.delete(fileEntityToDelete);
        return mapUserToDto(user);
    }

    @Transactional
    public UserDTO addSavedCourse(Long userId, Long courseId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));
        user.getSavedCourses().add(course);
        return mapUserToDto(userRepository.save(user));
    }

    @Transactional
    public UserDTO deleteSavedCourse(Long userId, Long courseId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        user.getSavedCourses().removeIf(c -> c.getId().equals(courseId));
        return mapUserToDto(userRepository.save(user));
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
        return userRepository.searchUsersByKeyword(keyword).stream().map(UserService::mapUserToDto).collect(Collectors.toList());
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
        return mapUserToDto(user);
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
        return mapUserToDto(user);
    }

    @Transactional
    public List<Review> removeReviewFromUser(Long userId, Long reviewId) {
        Review reviewToDelete = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NoSuchElementException("Review not found with ID: " + reviewId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        user.getReviews().remove(reviewToDelete);
        List<Review> updatedReviews = userRepository.save(user).getReviews();
        reviewRepository.delete(reviewToDelete);
        return updatedReviews;
    }

    public static UserDTO mapUserToDto(User user) {
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
        if (user.getProfilePic() != null) {
            userDTO.setProfilePicturePath(FILES_SERVING_ENDPOINT + '/' + user.getProfilePic().getFileName());
        }
        userDTO.setTags(user.getTags());
        userDTO.setFollowersIds(user.getFollowers().stream().map(User::getId).collect(Collectors.toList()));
        userDTO.setFollowingsIds(user.getFollowings().stream().map(User::getId).collect(Collectors.toList()));
        userDTO.setPublishedCoursesIds(user.getPublishedCourses().stream().map(Course::getId).collect(Collectors.toList()));
        userDTO.setTakenCoursesIds(user.getTakenCourses().stream().map(Course::getId).collect(Collectors.toList()));
        userDTO.setDraftCoursesIds(user.getDraftCourses().stream().map(Course::getId).collect(Collectors.toList()));
        userDTO.setSavedCoursesIds(user.getSavedCourses().stream().map(Course::getId).collect(Collectors.toList()));
//        userDTO.setAuthorities(user.getAuthorities()); //this is causing cyclic relationship
        return userDTO;
    }
}
