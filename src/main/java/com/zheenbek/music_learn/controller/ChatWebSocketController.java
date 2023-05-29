package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.chat.ChatMessageDTO;
import com.zheenbek.music_learn.entity.chat.ChatFile;
import com.zheenbek.music_learn.entity.chat.ChatMessage;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.service.UserService;
import com.zheenbek.music_learn.service.chat.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;

@Controller
@CrossOrigin(origins = "https://v1910509.hosted-by-vdsina.ru", allowCredentials = "true")
public class ChatWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    private final UserService userService;
    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatWebSocketController(UserService userService, ChatMessageService chatMessageService, SimpMessagingTemplate messagingTemplate) {
        this.userService = userService;
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/private/{privateChatId}/sendPrivateMessage")
    public void sendPrivateMessage(@DestinationVariable("privateChatId") Long privateChatId, @Payload ChatMessageDTO chatMessageDTO) {
        if (chatMessageDTO.getSenderId() == null) {
            throw new IllegalArgumentException("Receiver is missing from chat message in private chat with ID: " + privateChatId);
        }
        // Retrieve the sender user
        User senderUser = userService.getUserById(chatMessageDTO.getSenderId());

        // Create a ChatMessage
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(senderUser);
        chatMessage.setContent(chatMessageDTO.getContent());
        chatMessage.setCreatedAt(new Date());

        // Save the message using the ChatMessageService
        ChatMessageDTO createdMessage = chatMessageService.saveChatMessage(chatMessage, privateChatId);

        // Send the message to the recipient via WebSocket
        String destination = "/topic/private/" + privateChatId;
        messagingTemplate.convertAndSend(destination, createdMessage);
    }


    @MessageMapping("/chat.sendFile/{recipientId}")
    public void sendFile(@Payload byte[] fileBytes, @Header("file-name") String fileName, @Header("file-type") String fileType, @DestinationVariable("recipientId") String recipientId) {
        // Save the file and perform necessary operations

        ChatFile chatFile = new ChatFile(fileName, fileType);
        // Add any additional file information to the ChatFile object

        messagingTemplate.convertAndSendToUser(recipientId, "/queue/file", chatFile);
    }
}
