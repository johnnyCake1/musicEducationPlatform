package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Role;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.RoleRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository userRepository) {
        this.roleRepository = userRepository;
    }

    public Role saveRole (User user, Role role) {
        role.setUser(user);
        return roleRepository.save(role);
    }

    public Set<Role> findByUser(User user){
        return roleRepository.findByUser(user);
    }
}
