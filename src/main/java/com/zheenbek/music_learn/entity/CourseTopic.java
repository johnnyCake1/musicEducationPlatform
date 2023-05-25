package com.zheenbek.music_learn.entity;

import javax.persistence.Entity;
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
    @OneToOne
    private ContentData contentData;

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

    public ContentData getContentData() {
        return contentData;
    }

    public void setContentData(ContentData contentData) {
        this.contentData = contentData;
    }

    //    public FileEntity getDisplayableFile() {
//        return displayableFile;
//    }
//
//    public DisplayableContentType getContentType() {
//        return contentType;
//    }
//
//    public void setContentType(DisplayableContentType contentType) {
//        this.contentType = contentType;
//    }
//
//    public void setDisplayableFile(FileEntity displayableFile) {
//        this.displayableFile = displayableFile;
//    }

}

