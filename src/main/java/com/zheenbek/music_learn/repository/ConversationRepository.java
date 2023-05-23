package com.zheenbek.music_learn.repository;

import com.zheenbek.music_learn.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByParticipantsId(Long userId);
}
