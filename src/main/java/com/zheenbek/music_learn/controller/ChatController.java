package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.entity.chat.ChatMessage;
import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.service.chat.ChatMessageService;
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
public class ChatController {
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(ChatMessageService chatMessageService2, SimpMessagingTemplate messagingTemplate) {
        this.chatMessageService = chatMessageService2;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage (@Payload ChatMessage chatMessage) {
        ChatMessage savedMessage = chatMessageService.save(chatMessage);

        List<ChatMessage> recipientChatMessages = chatMessageService.findChatMessages(savedMessage.getSenderId(), savedMessage.getRecipientId());
        List<ChatMessage> senderChatMessages = chatMessageService.findChatMessages(savedMessage.getSenderId(), savedMessage.getRecipientId());

        List<ChatRoom> recipientChatRooms = chatMessageService.findChatRoomsOfUser(savedMessage.getRecipientId());
        List<ChatRoom> senderChatRooms = chatMessageService.findChatRoomsOfUser(savedMessage.getSenderId());
        //send to recipient
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getRecipientId()), "queue/messages",
                recipientChatMessages
        );
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getRecipientId()), "queue/chatrooms",
                recipientChatRooms
        );
        //send to sender himself
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getSenderId()), "queue/messages",
                senderChatMessages
        );
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getSenderId()), "queue/chatrooms",
                senderChatRooms
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages (@PathVariable Long senderId, @PathVariable Long recipientId) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

    @GetMapping("/messages/{userId}")
    public ResponseEntity<List<ChatRoom>> findChatRoomsOfUser (@PathVariable Long userId) {
        return ResponseEntity.ok(chatMessageService.findChatRoomsOfUser(userId));
    }

}
