package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.Role;
import com.zheenbek.music_learn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Set<Role> findByUser(User user);
}
