package com.zheenbek.music_learn.dto.response.course;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.zheenbek.music_learn.dto.request_response.ReviewDTO;
import com.zheenbek.music_learn.dto.request_response.course.CourseModuleDTO;
import com.zheenbek.music_learn.dto.request_response.user.UserDTO;
import com.zheenbek.music_learn.entity.Review;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseResponseDTO {
    private Long id;
    private Long authorId;
    private UserDTO author;
    private double price;
    private String courseName;
    private String courseShortDescription;
    private String courseLongDescription;
    private CategoryResponseDTO category;
    @JsonProperty(value = "video_id")
    private Long promoVideoId;
    @JsonProperty(value = "video_url")
    private String promoVideoPath;
    @JsonProperty(value = "img_id")
    private Long previewImageId;
    @JsonProperty(value = "img_url")
    private String previewImagePath;
    private List<Long> enrolledStudentsIds = new ArrayList<>();
    private List<Long> savedInStudentsIds = new ArrayList<>();
    private List<UserDTO> enrolledStudents = new ArrayList<>();
    private List<CourseModuleDTO> curriculum = new ArrayList<>();
    private List<String> requirements = new ArrayList<>();
    private List<String> whatYouWillLearn = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private List<ReviewDTO> reviews = new ArrayList<>();
    private Date creationDate;
    private Date lastUpdatedDate;
    private boolean isPublished;

    public CourseResponseDTO() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseShortDescription() {
        return courseShortDescription;
    }

    public void setCourseShortDescription(String courseShortDescription) {
        this.courseShortDescription = courseShortDescription;
    }

    public String getPreviewImagePath() {
        return previewImagePath;
    }

    /**
     * previewImagePath should contain the user's profile picture in the following pattern: "localhost:8080/my-image.png"
     *
     * @param previewImagePath must follow the mentioned pattern
     */
    public void setPreviewImagePath(String previewImagePath) {
        this.previewImagePath = previewImagePath;
    }

    public String getPromoVideoPath() {
        return promoVideoPath;
    }

    /**
     * promoVideoPath should contain the user's profile picture in the following pattern: "localhost:8080/my-video.mp4"
     *
     * @param promoVideoPath must follow the mentioned pattern
     */
    public void setPromoVideoPath(String promoVideoPath) {
        this.promoVideoPath = promoVideoPath;
    }

    public String getCourseLongDescription() {
        return courseLongDescription;
    }

    public void setCourseLongDescription(String courseLongDescription) {
        this.courseLongDescription = courseLongDescription;
    }

    public List<Long> getEnrolledStudentsIds() {
        return enrolledStudentsIds;
    }

    public void setEnrolledStudentsIds(List<Long> enrolledStudentsIds) {
        this.enrolledStudentsIds = enrolledStudentsIds;
    }

    public List<CourseModuleDTO> getCurriculum() {
        return curriculum;
    }

    public void setCurriculum(List<CourseModuleDTO> curriculum) {
        this.curriculum = curriculum;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public List<String> getWhatYouWillLearn() {
        return whatYouWillLearn;
    }

    public void setWhatYouWillLearn(List<String> whatYouWillLearn) {
        this.whatYouWillLearn = whatYouWillLearn;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<ReviewDTO> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDTO> reviews) {
        this.reviews = reviews;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(Date lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public List<Long> getSavedInStudentsIds() {
        return savedInStudentsIds;
    }

    public void setSavedInStudentsIds(List<Long> savedInStudentsIds) {
        this.savedInStudentsIds = savedInStudentsIds;
    }

    public Long getPromoVideoId() {
        return promoVideoId;
    }

    public void setPromoVideoId(Long promoVideoId) {
        this.promoVideoId = promoVideoId;
    }

    public Long getPreviewImageId() {
        return previewImageId;
    }

    public void setPreviewImageId(Long previewImageId) {
        this.previewImageId = previewImageId;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserDTO author) {
        this.author = author;
    }

    public List<UserDTO> getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(List<UserDTO> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }

    public CategoryResponseDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryResponseDTO category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CourseResponseDTO courseDTO = (CourseResponseDTO) o;
        return Double.compare(price, courseDTO.price) == 0 && isPublished == courseDTO.isPublished && Objects.equals(id, courseDTO.id) && Objects.equals(authorId, courseDTO.authorId) && Objects.equals(author, courseDTO.author) && Objects.equals(courseName, courseDTO.courseName) && Objects.equals(courseShortDescription, courseDTO.courseShortDescription) && Objects.equals(courseLongDescription, courseDTO.courseLongDescription) && Objects.equals(category, courseDTO.category) && Objects.equals(promoVideoId, courseDTO.promoVideoId) && Objects.equals(promoVideoPath, courseDTO.promoVideoPath) && Objects.equals(previewImageId, courseDTO.previewImageId) && Objects.equals(previewImagePath, courseDTO.previewImagePath) && Objects.equals(enrolledStudentsIds, courseDTO.enrolledStudentsIds) && Objects.equals(savedInStudentsIds, courseDTO.savedInStudentsIds) && Objects.equals(enrolledStudents, courseDTO.enrolledStudents) && Objects.equals(curriculum, courseDTO.curriculum) && Objects.equals(requirements, courseDTO.requirements) && Objects.equals(whatYouWillLearn, courseDTO.whatYouWillLearn) && Objects.equals(tags, courseDTO.tags) && Objects.equals(reviews, courseDTO.reviews) && Objects.equals(creationDate, courseDTO.creationDate) && Objects.equals(lastUpdatedDate, courseDTO.lastUpdatedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, authorId, author, price, courseName, courseShortDescription, courseLongDescription, category, promoVideoId, promoVideoPath, previewImageId, previewImagePath, enrolledStudentsIds, savedInStudentsIds, enrolledStudents, curriculum, requirements, whatYouWillLearn, tags, reviews, creationDate, lastUpdatedDate, isPublished);
    }
}
