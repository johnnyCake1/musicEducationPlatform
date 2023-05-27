package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByUsername(String username);

    @Query("SELECT u FROM users u WHERE " +
            "LOWER(u.username) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(u.firstName) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(u.lastName) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "LOWER(u.aboutMe) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
            "(:keyword) MEMBER OF u.tags OR " +
            "EXISTS (SELECT c FROM u.publishedCourses c WHERE LOWER(c.courseName) LIKE CONCAT('%', LOWER(:keyword), '%')) OR " +
            "EXISTS (SELECT t FROM u.publishedCourses c JOIN c.tags t WHERE LOWER(t) LIKE CONCAT('%', LOWER(:keyword), '%'))")
    List<User> searchUsersByKeyword(@Param("keyword") String keyword);

}
