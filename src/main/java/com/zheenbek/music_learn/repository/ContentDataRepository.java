package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.course.ContentData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentDataRepository extends JpaRepository<ContentData, Long> {
}