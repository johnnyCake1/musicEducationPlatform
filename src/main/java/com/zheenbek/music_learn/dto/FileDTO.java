package com.zheenbek.music_learn.dto;

import org.springframework.core.io.Resource;

public class FileDTO {
    private Long fileId;
    private Resource fileResource;

    public FileDTO(){

    }
    public FileDTO(Long fileId, Resource fileResource) {
        this.fileId = fileId;
        this.fileResource = fileResource;
    }

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public Resource getFileResource() {
        return fileResource;
    }

    public void setFileResource(Resource fileResource) {
        this.fileResource = fileResource;
    }
}
