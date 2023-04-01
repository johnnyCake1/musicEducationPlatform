package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entities.Student;
import org.springframework.stereotype.Service;

@Service
public interface StudentService {
    Student saveStudent (Student s);

}
