package com.zheenbek.music_learn.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTopicDTO {
    private Long id;
    private String topicName;
    private ContentDataDTO contentData;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public ContentDataDTO getContentData() {
        return contentData;
    }

    public void setContentData(ContentDataDTO contentData) {
        this.contentData = contentData;
    }
}
