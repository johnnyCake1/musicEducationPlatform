package com.zheenbek.music_learn.service.chat;

import com.zheenbek.music_learn.entity.chat.ChatMessage;
import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.repository.chat.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;

    public ChatMessageService(ChatMessageRepository chatMessage2Repository, ChatRoomService chatRoomService) {
        this.chatMessageRepository = chatMessage2Repository;
        this.chatRoomService = chatRoomService;
    }

    public ChatMessage save(ChatMessage chatMessage) {
        ChatRoom chatRoom = chatRoomService.getChatRoom(
                    chatMessage.getSenderId(),
                    chatMessage.getRecipientId(),
                    true
                ).orElseThrow();
        ChatRoom chatRoom2 = chatRoomService.getChatRoom(
                chatMessage.getRecipientId(),
                chatMessage.getSenderId()
        ).orElseThrow();
        chatMessage.setChatId(chatRoom.getChatRoomId());
        ChatMessage newMessage = chatMessageRepository.save(chatMessage);
        chatRoom.setLastMessage(newMessage);
        chatRoom2.setLastMessage(newMessage);
        chatRoomService.save(chatRoom);
        chatRoomService.save(chatRoom2);
        return newMessage;
    }

    public List<ChatMessage> findChatMessages(Long senderId, Long recipientId) {
        // a little bit dubious
        return chatRoomService
                .getChatRoom(senderId, recipientId)
                .map(ChatRoom::getChatRoomId)
                .map(chatMessageRepository::findByChatId)
                .orElse(new ArrayList<>());
    }

    public List<ChatRoom> findChatRoomsOfUser(Long userId) {
        return chatRoomService.getChatRoomsBySenderId(userId);
    }
}
