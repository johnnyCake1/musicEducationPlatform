package com.zheenbek.music_learn.service.chat;

import com.zheenbek.music_learn.entity.chat.ChatMessage2;
import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.repository.chat.ChatMessage2Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageService2 {
    private final ChatMessage2Repository chatMessage2Repository;
    private final ChatRoomService chatRoomService;

    public ChatMessageService2(ChatMessage2Repository chatMessage2Repository, ChatRoomService chatRoomService) {
        this.chatMessage2Repository = chatMessage2Repository;
        this.chatRoomService = chatRoomService;
    }

    public ChatMessage2 save(ChatMessage2 chatMessage2) {
        String chatId = chatRoomService.getChatRoomId(
                chatMessage2.getSenderId(),
                chatMessage2.getRecipientId(),
                true)
                .orElseThrow();
        chatMessage2.setChatId(chatId);
        return chatMessage2Repository.save(chatMessage2);
    }

    public List<ChatMessage2> findChatMessages(Long senderId, Long recipientId) {
        return chatRoomService
                .getChatRoomId(senderId, recipientId)
                .map(chatMessage2Repository::findByChatId)
                .orElse(new ArrayList<>());
    }

    public List<ChatRoom> findChatRoomsOfUser(Long userId) {
        return chatRoomService.getChatRoomsBySenderId(userId);
    }
}
