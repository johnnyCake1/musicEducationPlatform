package com.zheenbek.music_learn.config;

import com.zheenbek.music_learn.entity.chat.ChatMessage;
import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.service.chat.ChatMessageService;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.List;
import java.util.Optional;

@Component
public class WebSocketEventListener implements ApplicationListener<SessionSubscribeEvent> {

    private final ChatMessageService chatMessageService;

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(ChatMessageService chatMessageService, SimpMessagingTemplate simpMessagingTemplate) {
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void onApplicationEvent(SessionSubscribeEvent event) {
        System.out.println("Someone subscribed: " + event.getMessage());

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("ALL NATIVE HEADERS: " + headerAccessor.toNativeHeaderMap());

        String destination = headerAccessor.getDestination();

        try {
            Long recipientId = extractRecipientId(headerAccessor);
            if (destination.contains("/queue/chatrooms")) {
                sendChatRooms(recipientId);
            } else if (destination.contains("/queue/messages")) {
                Long senderId = extractSenderId(headerAccessor); // Optional: senderId might not always be required
                if (senderId != null) {
                    sendMessages(senderId, recipientId);
                }
            }
        } catch (NumberFormatException e) {
            System.out.println("WARNING: Couldn't convert ID to Long");
        }
    }


    private Long extractSenderId(StompHeaderAccessor headerAccessor) {
        return Optional.ofNullable(headerAccessor.toNativeHeaderMap().get("senderId"))
                .flatMap(list -> list.stream().findFirst())
                .map(Long::parseLong)
                .orElse(null);
    }

    private Long extractRecipientId(StompHeaderAccessor headerAccessor) throws IllegalArgumentException {
        return Optional.ofNullable(headerAccessor.toNativeHeaderMap().get("recipientId"))
                .flatMap(list -> list.stream().findFirst())
                .map(Long::parseLong)
                .orElseThrow(() -> new IllegalArgumentException("Recipient ID is required but was not provided"));
    }


    private void sendChatRooms(Long recipientId) {
        // Logic to send chat rooms
        List<ChatRoom> chatRooms = chatMessageService.findChatRoomsOfUser(recipientId);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(recipientId), "/queue/chatrooms",
                chatRooms
        );
    }

    private void sendMessages(Long senderId, Long recipientId) {
        // Logic to send messages
        List<ChatMessage> chatMessages = chatMessageService.findChatMessages(senderId, recipientId);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(recipientId), "/queue/messages",
                chatMessages
        );
    }

}