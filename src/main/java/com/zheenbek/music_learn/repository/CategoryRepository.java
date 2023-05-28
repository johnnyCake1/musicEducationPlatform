package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.course.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}