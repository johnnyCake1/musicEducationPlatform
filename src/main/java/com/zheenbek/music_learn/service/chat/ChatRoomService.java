package com.zheenbek.music_learn.service.chat;

import com.zheenbek.music_learn.entity.chat.ChatRoom;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.chat.ChatRoomRepository;
import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.zheenbek.music_learn.service.FileService.FILES_SERVING_ENDPOINT;

@Service
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public Optional<ChatRoom> getChatRoom(Long senderId, Long recipientId) {
        return getChatRoom(senderId, recipientId, false);
    }

    public Optional<ChatRoom> getChatRoom(Long senderId, Long recipientId, boolean createRoomIfNotExists) {
        return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId)
                .or(() -> {
                    if (createRoomIfNotExists) {
                        ChatRoom chatRoom = createChatRoom(senderId, recipientId);
                        return Optional.of(chatRoom);
                    }
                    return Optional.empty();
                });
    }

    public List<ChatRoom> getChatRoomsBySenderId(Long senderId) {
        return chatRoomRepository.findBySenderIdOrderByLastMessageTimestampDesc(senderId)
                .orElse(Collections.emptyList());
    }

    public ChatRoom save (ChatRoom chatRoom) {
        return chatRoomRepository.save(chatRoom);
    }

    private ChatRoom createChatRoom(Long senderId, Long recipientId) {
        String chatRoomId = String.format("%s_%s", senderId, recipientId);
        User recipientUser = userRepository.findById(recipientId).orElseThrow();
        User senderUser = userRepository.findById(senderId).orElseThrow();

        chatRoomRepository.save(new ChatRoom(recipientId, senderId, chatRoomId, senderUser.getUsername(), FILES_SERVING_ENDPOINT + '/' + senderUser.getProfilePic().getFileName()));
        return chatRoomRepository.save(new ChatRoom(senderId, recipientId, chatRoomId, recipientUser.getUsername(), FILES_SERVING_ENDPOINT + '/' + recipientUser.getProfilePic().getFileName()));
    }

}
