package com.zheenbek.music_learn.dto.course;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseModuleDTO {
    private Long id;
    private String moduleName;

    private List<CourseTopicDTO> courseTopics = new ArrayList<>();

    public CourseModuleDTO() {

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

    public List<CourseTopicDTO> getCourseTopics() {
        return courseTopics;
    }

    public void setCourseTopics(List<CourseTopicDTO> courseTopics) {
        this.courseTopics = courseTopics;
    }
}
