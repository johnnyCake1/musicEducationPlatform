package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
}