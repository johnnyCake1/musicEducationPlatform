package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.CourseTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTopicRepository extends JpaRepository<CourseTopic, Long> {
}