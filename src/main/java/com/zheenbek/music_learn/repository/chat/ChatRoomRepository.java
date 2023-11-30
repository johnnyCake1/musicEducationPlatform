package com.zheenbek.music_learn.repository.chat;

import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.entity.chat.PrivateChat;
import com.zheenbek.music_learn.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

}
