package com.zheenbek.music_learn.entity.course;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String question;
    @ElementCollection
    private List<String> options = new ArrayList<>();
    @ElementCollection
    private List<String> correctOptions = new ArrayList<>();


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public List<String> getCorrectOptions() {
        return correctOptions;
    }

    public void setCorrectOptions(List<String> correctOptions) {
        this.correctOptions = correctOptions;
    }
}