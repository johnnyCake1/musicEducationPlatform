package com.zheenbek.music_learn.dto.request_response;

import com.zheenbek.music_learn.dto.request_response.user.UserDTO;

public class ReviewDTO {
    private Long id;
    private float rating;
    private UserDTO reviewer;
    private String reviewMessage;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public UserDTO getReviewer() {
        return reviewer;
    }

    public void setReviewer(UserDTO reviewer) {
        this.reviewer = reviewer;
    }

    public String getReviewMessage() {
        return reviewMessage;
    }

    public void setReviewMessage(String reviewMessage) {
        this.reviewMessage = reviewMessage;
    }
}
