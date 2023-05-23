package com.zheenbek.music_learn.entity;

import com.fasterxml.jackson.annotation.JsonIdentityReference;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class CourseTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String topicName;
    public enum DisplayableContentType {
        FILE,
        QUIZ,
        UNKNOWN
    }
    @Enumerated(EnumType.STRING)
    private DisplayableContentType contentType;
    @OneToOne
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity displayableFile;

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

    public FileEntity getDisplayableFile() {
        return displayableFile;
    }

    public DisplayableContentType getContentType() {
        return contentType;
    }

    public void setContentType(DisplayableContentType contentType) {
        this.contentType = contentType;
    }

    public void setDisplayableFile(FileEntity displayableFile) {
        this.displayableFile = displayableFile;
    }

}

