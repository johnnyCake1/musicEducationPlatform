package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Assignment;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.AssignmentRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save (User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username){
        return userRepository.findUserByUsername(username);
    }
}
