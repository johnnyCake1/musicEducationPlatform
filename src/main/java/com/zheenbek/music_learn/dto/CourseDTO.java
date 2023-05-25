package com.zheenbek.music_learn.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zheenbek.music_learn.entity.Review;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseDTO {
    private Long id;
    private Long authorId;
    private float price;
    private String courseName;
    private String courseShortDescription;
    private String courseLongDescription;
    private List<Long> enrolledStudentsIds = new ArrayList<>();
    private List<CourseModuleDTO> curriculum = new ArrayList<>();
    private List<String> requirements = new ArrayList<>();
    private List<String> whatYouWillLearn = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
//    private MultipartFile promoVideo;
//    private MultipartFile previewPicture;
    private List<Review> reviews = new ArrayList<>();
    private Date creationDate;
    private Date lastUpdatedDate;

    public CourseDTO() {

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

//    public MultipartFile getPromoVideo() {
//        return promoVideo;
//    }
//
//    public void setPromoVideo(MultipartFile promoVideo) {
//        this.promoVideo = promoVideo;
//    }
//
//    public MultipartFile getPreviewPicture() {
//        return previewPicture;
//    }
//
//    public void setPreviewPicture(MultipartFile previewPicture) {
//        this.previewPicture = previewPicture;
//    }

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
}
