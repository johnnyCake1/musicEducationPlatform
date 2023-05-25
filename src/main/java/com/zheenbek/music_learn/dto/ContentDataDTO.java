package com.zheenbek.music_learn.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zheenbek.music_learn.entity.ContentData;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ContentDataDTO {
    private Long id;
    private ContentData.ContentType contentType;
    private Long fileId;

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
}
