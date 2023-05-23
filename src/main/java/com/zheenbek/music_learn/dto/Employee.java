package com.zheenbek.music_learn.dto;

import org.springframework.web.multipart.MultipartFile;

public class Employee {
    private String name;
    private MultipartFile document;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MultipartFile getDocument() {
        return document;
    }

    public void setDocument(MultipartFile document) {
        this.document = document;
    }

}