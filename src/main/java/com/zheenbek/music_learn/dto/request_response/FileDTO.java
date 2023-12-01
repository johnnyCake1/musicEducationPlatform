package com.zheenbek.music_learn.dto.request_response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FileDTO {
    private Long id;
    @JsonProperty (value = "file_url")
    private String filePath;
    private String mediaType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }
}
