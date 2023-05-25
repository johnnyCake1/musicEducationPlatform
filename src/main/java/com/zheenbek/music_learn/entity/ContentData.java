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
public class ContentData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public enum ContentType {
        FILE,
        QUIZ,
        UNKNOWN
    }
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    @OneToOne
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity file;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public FileEntity getFile() {
        return file;
    }

    public void setFile(FileEntity file) {
        this.file = file;
    }
}
