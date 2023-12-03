package com.zheenbek.music_learn.repository.chat;

import com.zheenbek.music_learn.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);
    Optional<List<ChatRoom>> getChatRoomBySenderId(Long senderId);
    Optional<List<ChatRoom>> findBySenderIdOrderByLastMessageTimestampAsc(Long senderId);

}
