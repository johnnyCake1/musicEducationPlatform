package com.zheenbek.music_learn.repository.chat;

import com.zheenbek.music_learn.entity.chat.PrivateChat;
import com.zheenbek.music_learn.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrivateChatRepository extends JpaRepository<PrivateChat, Long> {
    Optional<PrivateChat> findByParticipantsContainingAndParticipantsContaining(User user1, User user2);
    // Additional custom query methods if needed
}