package com.zheenbek.music_learn.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class CourseModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String moduleName;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "course_module_id")
    private List<CourseTopic> courseTopics;

    public CourseModule() {
        this.courseTopics = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public List<CourseTopic> getCourseTopics() {
        return courseTopics;
    }

    public void setCourseTopics(List<CourseTopic> courseTopics) {
        this.courseTopics = courseTopics;
    }


}
