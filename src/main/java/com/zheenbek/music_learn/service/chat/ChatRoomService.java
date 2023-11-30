package com.zheenbek.music_learn.service.chat;

import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.chat.ChatRoomRepository;
import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public Optional<String> getChatRoomId(Long senderId, Long recipientId) {
        return getChatRoomId(senderId, recipientId, false);
    }

    public Optional<String> getChatRoomId(Long senderId, Long recipientId, boolean createRoomIfNotExists) {
        return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoom::getChatRoomId)
                .or(() -> {
                    if (createRoomIfNotExists) {
                        String chatRoomId = createChatRoom(senderId, recipientId);
                        return Optional.of(chatRoomId);
                    }
                    return Optional.empty();
                });
    }

    private String createChatRoom(Long senderId, Long recipientId) {
        String chatRoomId = String.format("%s_%s", senderId, recipientId);
        User recipientUser = userRepository.findById(recipientId).orElseThrow();
        User senderUser = userRepository.findById(senderId).orElseThrow();

        chatRoomRepository.save(new ChatRoom(senderId, recipientId, chatRoomId, recipientUser.getUsername()));
        chatRoomRepository.save(new ChatRoom(recipientId, senderId, chatRoomId, senderUser.getUsername()));
        return chatRoomId;
    }

}
