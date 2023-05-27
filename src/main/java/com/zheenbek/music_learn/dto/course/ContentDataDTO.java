package com.zheenbek.music_learn.dto.course;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zheenbek.music_learn.entity.course.ContentData;
import com.zheenbek.music_learn.entity.course.Question;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ContentDataDTO {
    private Long id;
    private ContentData.ContentType contentType;
    private Long fileId;
    private List<Question> quiz;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ContentData.ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentData.ContentType contentType) {
        this.contentType = contentType;
    }

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public List<Question> getQuiz() {
        return quiz;
    }

    public void setQuiz(List<Question> quiz) {
        this.quiz = quiz;
    }
}
