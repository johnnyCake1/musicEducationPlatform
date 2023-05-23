package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.Assignment;
import com.zheenbek.music_learn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Set<Assignment> findByAssignedTo(User user);
}
