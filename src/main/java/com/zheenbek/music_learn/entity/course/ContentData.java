package com.zheenbek.music_learn.entity.course;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.zheenbek.music_learn.entity.FileEntity;

import javax.persistence.*;
import java.util.List;

@Entity
public class ContentData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public enum ContentType {
        FILE,
        DOC,
        IMAGE,
        VIDEO,
        QUIZ,
        TEXT,
        UNKNOWN
    }
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity file;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> quiz;
    @Column(length = 10000)
    private String text;

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

    public List<Question> getQuiz() {
        return quiz;
    }

    public void setQuiz(List<Question> quiz) {
        this.quiz = quiz;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
