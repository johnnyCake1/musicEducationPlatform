package com.zheenbek.music_learn.repository.user;

import com.zheenbek.music_learn.entity.user.Role;
import com.zheenbek.music_learn.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Set<Role> findByUser(User user);

    Set<Role> findByUserId(Long userId);
}
