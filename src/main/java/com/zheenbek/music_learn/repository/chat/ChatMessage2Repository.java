package com.zheenbek.music_learn.repository.chat;

import com.zheenbek.music_learn.entity.chat.ChatMessage2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessage2Repository extends JpaRepository<ChatMessage2, Long> {

    List<ChatMessage2> findByChatId(String s);
}

