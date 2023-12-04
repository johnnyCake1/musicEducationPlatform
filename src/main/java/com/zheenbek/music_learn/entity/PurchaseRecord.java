package com.zheenbek.music_learn.entity;

import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.user.User;

import javax.persistence.*;
import java.util.Date;

@Entity
public class PurchaseRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @OneToOne
    private Course course;

    @Column(nullable = false)
    private Float amount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date purchaseDate;

    public PurchaseRecord() {}

    public PurchaseRecord(User user, Course course, Float amount, Date purchaseDate) {
        this.user = user;
        this.course = course;
        this.amount = amount;
        this.purchaseDate = purchaseDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
}
