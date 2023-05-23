package com.zheenbek.music_learn.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zheenbek.music_learn.entity.CourseModule;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;

import java.util.ArrayList;
import java.util.List;

public class CourseDTO {

    private Long id;
    private Long authorId;
    private List<Long> enrolledStudentsId;
    private List<CourseModule> curriculum;
    private float price;
    private String courseName;
    private String courseShortDescription;
    private String courseLongDescription;
    private FileEntity promoVideo;
    private List<String> requirements;
    private List<String> whatYouWillLearn;
    private List<Review> reviews;

    public CourseDTO() {
        this.enrolledStudentsId = new ArrayList<>();
        this.curriculum = new ArrayList<>();
        this.requirements = new ArrayList<>();
        this.whatYouWillLearn = new ArrayList<>();
        this.reviews = new ArrayList<>();
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
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

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public List<Long> getEnrolledStudentsId() {
        return enrolledStudentsId;
    }

    public void setEnrolledStudentsId(List<Long> enrolledStudentsId) {
        this.enrolledStudentsId = enrolledStudentsId;
    }

    public List<CourseModule> getCurriculum() {
        return curriculum;
    }

    public void setCurriculum(List<CourseModule> curriculum) {
        this.curriculum = curriculum;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public FileEntity getPromoVideo() {
        return promoVideo;
    }

    public void setPromoVideo(FileEntity promoVideo) {
        this.promoVideo = promoVideo;
    }

    public List<String> getWhatYouWillLearn() {
        return whatYouWillLearn;
    }

    public void setWhatYouWillLearn(List<String> whatYouWillLearn) {
        this.whatYouWillLearn = whatYouWillLearn;
    }
}
