package com.zheenbek.music_learn.dto.course;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoryDTO {
    private Long id;
    private String name;
    @JsonProperty(value = "img_url")
    private String picturePath;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicturePath() {
        return picturePath;
    }

    public void setPicturePath(String picturePath) {
        this.picturePath = picturePath;
    }
}
