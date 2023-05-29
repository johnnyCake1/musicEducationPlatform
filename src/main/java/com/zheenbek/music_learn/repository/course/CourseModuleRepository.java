package com.zheenbek.music_learn.repository.course;

import com.zheenbek.music_learn.entity.course.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
}