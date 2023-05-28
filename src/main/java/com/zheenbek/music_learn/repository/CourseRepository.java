package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByAuthorId(Long authorId);

    List<Course> findByEnrolledStudentsId(Long userId);
    List<Course> findAllByCategoryId(Long categoryId);

    @Query("SELECT c FROM Course c WHERE " +
            "LOWER(c.courseName) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(c.author.username) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(c.author.firstName) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(c.author.lastName) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(c.courseShortDescription) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(c.courseLongDescription) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "EXISTS (SELECT element FROM c.whatYouWillLearn element WHERE LOWER(element) LIKE CONCAT('%', LOWER(:keyword), '%'))")
    List<Course> searchCoursesByKeyword(@Param("keyword") String keyword);


}
