package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.chat.ChatNotification;
import com.zheenbek.music_learn.entity.chat.ChatMessage2;
import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.service.chat.ChatMessageService2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
public class ChatController2 {
    private final ChatMessageService2 chatMessageService2;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController2(ChatMessageService2 chatMessageService2, SimpMessagingTemplate messagingTemplate) {
        this.chatMessageService2 = chatMessageService2;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage (@Payload ChatMessage2 chatMessage2) {
        ChatMessage2 savedMessage = chatMessageService2.save(chatMessage2);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getRecipientId()), "queue/messages",
                new ChatNotification(savedMessage.getId(), savedMessage.getSenderId(), savedMessage.getRecipientId(), savedMessage.getContent())
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage2>> findChatMessages (@PathVariable Long senderId, @PathVariable Long recipientId) {
        return ResponseEntity.ok(chatMessageService2.findChatMessages(senderId, recipientId));
    }

    @GetMapping("/messages/{userId}")
    public ResponseEntity<List<ChatRoom>> findChatRoomsOfUser (@PathVariable Long userId) {
        return ResponseEntity.ok(chatMessageService2.findChatRoomsOfUser(userId));
    }

}
