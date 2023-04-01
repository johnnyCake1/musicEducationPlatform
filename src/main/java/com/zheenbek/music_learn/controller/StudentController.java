package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.entities.Student;
import com.zheenbek.music_learn.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class StudentController {
    private StudentService studentService;

    @Autowired
    public void setStudentService(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/add")
    public String addStudent (@RequestBody Student student){
        studentService.saveStudent(student);
        return "student " + student.getName() + " is added";
    }

    @GetMapping
    public String getStudent (){
        return "Getting a student!";
    }
}
