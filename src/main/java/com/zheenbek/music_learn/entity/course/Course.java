package com.zheenbek.music_learn.entity.course;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import com.zheenbek.music_learn.entity.user.User;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JsonIdentityReference(alwaysAsId = true)
    private User author;
    @ManyToMany
    @JoinTable(
            name = "course_enrolled_students",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @JsonIdentityReference(alwaysAsId = true)
    private List<User> enrolledStudents = new ArrayList<>();
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "course_id")
    private List<CourseModule> curriculum = new ArrayList<>();
    private float price;
    private String courseName;
    private String courseShortDescription;
    private String courseLongDescription;
    @OneToOne
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity promoVideo;
    @OneToOne
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity previewImage;
    @ElementCollection
    private List<String> requirements = new ArrayList<>();
    @ElementCollection
    private List<String> whatYouWillLearn = new ArrayList<>();
    @ElementCollection
    private List<String> tags = new ArrayList<>();
    @OneToMany
    private List<Review> reviews = new ArrayList<>();
    private boolean isPublished;
    private Date creationDate;
    private Date lastUpdatedDate;
    public Course (){

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

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public List<User> getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(List<User> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
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

    public FileEntity getPreviewImage() {
        return previewImage;
    }

    public void setPreviewImage(FileEntity previewImage) {
        this.previewImage = previewImage;
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

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }
}
