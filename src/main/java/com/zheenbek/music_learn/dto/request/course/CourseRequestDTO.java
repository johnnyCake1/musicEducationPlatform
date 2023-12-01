package com.zheenbek.music_learn.dto.request.course;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.zheenbek.music_learn.dto.request_response.course.CourseModuleDTO;
import com.zheenbek.music_learn.dto.request_response.user.UserDTO;
import com.zheenbek.music_learn.entity.Review;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseRequestDTO {
    private Long id;
    private Long authorId;
    private UserDTO author;
    private float price;
    private String courseName;
    private String courseShortDescription;
    private String courseLongDescription;
    @JsonProperty(value = "category_id")
    private Long categoryId;
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
    private List<Review> reviews = new ArrayList<>();
    private Date creationDate;
    private Date lastUpdatedDate;
    private boolean isPublished;

    public CourseRequestDTO() {

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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
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

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CourseRequestDTO that = (CourseRequestDTO) o;
        return Float.compare(price, that.price) == 0 && isPublished == that.isPublished && Objects.equals(id, that.id) && Objects.equals(authorId, that.authorId) && Objects.equals(author, that.author) && Objects.equals(courseName, that.courseName) && Objects.equals(courseShortDescription, that.courseShortDescription) && Objects.equals(courseLongDescription, that.courseLongDescription) && Objects.equals(categoryId, that.categoryId) && Objects.equals(promoVideoId, that.promoVideoId) && Objects.equals(promoVideoPath, that.promoVideoPath) && Objects.equals(previewImageId, that.previewImageId) && Objects.equals(previewImagePath, that.previewImagePath) && Objects.equals(enrolledStudentsIds, that.enrolledStudentsIds) && Objects.equals(savedInStudentsIds, that.savedInStudentsIds) && Objects.equals(enrolledStudents, that.enrolledStudents) && Objects.equals(curriculum, that.curriculum) && Objects.equals(requirements, that.requirements) && Objects.equals(whatYouWillLearn, that.whatYouWillLearn) && Objects.equals(tags, that.tags) && Objects.equals(reviews, that.reviews) && Objects.equals(creationDate, that.creationDate) && Objects.equals(lastUpdatedDate, that.lastUpdatedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, authorId, author, price, courseName, courseShortDescription, courseLongDescription, categoryId, promoVideoId, promoVideoPath, previewImageId, previewImagePath, enrolledStudentsIds, savedInStudentsIds, enrolledStudents, curriculum, requirements, whatYouWillLearn, tags, reviews, creationDate, lastUpdatedDate, isPublished);
    }
}
