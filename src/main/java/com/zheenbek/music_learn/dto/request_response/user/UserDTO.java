package com.zheenbek.music_learn.dto.request_response.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.zheenbek.music_learn.dto.request_response.FileDTO;
import com.zheenbek.music_learn.dto.request_response.ReviewDTO;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import org.springframework.security.core.GrantedAuthority;

import java.util.*;

public class UserDTO {
    private Long id;
    private String accessToken;
    private Date startDate;
    private String username;
    private String firstName;
    private String lastName;
    private String aboutMe;
    @JsonProperty(value = "img_url")
    private String profilePicturePath;
    @JsonProperty(value = "img_id")
    private Long profilePictureId;
    private List<String> tags;
    private List<Long> followersIds;
    private List<Long> followingsIds;
    private List<Long> publishedCoursesIds;
    private List<Long> takenCoursesIds;
    private List<Long> savedCoursesIds;
    private List<Long> draftCoursesIds;
    private List<FileDTO> storedFiles;
    private List<ReviewDTO> reviews;

    Collection<? extends GrantedAuthority> authorities = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDTO withAccessToken(String accessToken) {
        this.accessToken = accessToken;
        return this;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public String getUsername() {
        return username;
    }


    public String getProfilePicturePath() {
        return profilePicturePath;
    }

    /**
     * profilePicturePath should contain the user's profile picture in the following pattern: "localhost:8080/my-image.png"
     * @param profilePicturePath must follow the mentioned pattern
     */
    public void setProfilePicturePath(String profilePicturePath) {
        this.profilePicturePath = profilePicturePath;
    }




    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<Long> getFollowersIds() {
        return followersIds;
    }

    public void setFollowersIds(List<Long> followersIds) {
        this.followersIds = followersIds;
    }

    public List<Long> getFollowingsIds() {
        return followingsIds;
    }

    public void setFollowingsIds(List<Long> followingsIds) {
        this.followingsIds = followingsIds;
    }

    public List<Long> getPublishedCoursesIds() {
        return publishedCoursesIds;
    }

    public void setPublishedCoursesIds(List<Long> publishedCoursesIds) {
        this.publishedCoursesIds = publishedCoursesIds;
    }

    public List<Long> getTakenCoursesIds() {
        return takenCoursesIds;
    }

    public void setTakenCoursesIds(List<Long> takenCoursesIds) {
        this.takenCoursesIds = takenCoursesIds;
    }

    public List<Long> getSavedCoursesIds() {
        return savedCoursesIds;
    }

    public void setSavedCoursesIds(List<Long> savedCoursesIds) {
        this.savedCoursesIds = savedCoursesIds;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<FileDTO> getStoredFiles() {
        return storedFiles;
    }

    public void setStoredFiles(List<FileDTO> storedFiles) {
        this.storedFiles = storedFiles;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    public List<Long> getDraftCoursesIds() {
        return draftCoursesIds;
    }

    public void setDraftCoursesIds(List<Long> draftCoursesIds) {
        this.draftCoursesIds = draftCoursesIds;
    }

    public List<ReviewDTO> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDTO> reviews) {
        this.reviews = reviews;
    }

    public Long getProfilePictureId() {
        return profilePictureId;
    }

    public void setProfilePictureId(Long profilePictureId) {
        this.profilePictureId = profilePictureId;
    }
}
