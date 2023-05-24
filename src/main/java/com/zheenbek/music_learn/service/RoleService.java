package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Role;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository userRepository) {
        this.roleRepository = userRepository;
    }

    public Set<Role> getUserRole(User user){
        return roleRepository.findByUser(user);
    }

    public Set<Role> getUserRole(Long userId){
        return roleRepository.findByUserId(userId);
    }
}
