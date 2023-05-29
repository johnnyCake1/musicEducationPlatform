package com.zheenbek.music_learn.service.chat;

import com.zheenbek.music_learn.dto.chat.ChatMessageDTO;
import com.zheenbek.music_learn.dto.chat.PrivateChatDTO;
import com.zheenbek.music_learn.entity.chat.ChatMessage;
import com.zheenbek.music_learn.entity.chat.PrivateChat;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.chat.PrivateChatRepository;
import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.zheenbek.music_learn.service.FileService.FILES_SERVING_ENDPOINT;
import static com.zheenbek.music_learn.service.UserService.mapUserToDto;

@Service
public class PrivateChatService {
    private final PrivateChatRepository privateChatRepository;
    private final UserRepository userRepository;

    public PrivateChatService(PrivateChatRepository privateChatRepository, UserRepository userRepository) {
        this.privateChatRepository = privateChatRepository;
        this.userRepository = userRepository;
    }

    public PrivateChat getPrivateChatById(Long privateChatId) {
        return privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new EntityNotFoundException("Private chat not with ID: " + privateChatId));
    }
    public List<PrivateChatDTO> getUserPrivateChats(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID " + userId + " to get the private chats for"))
                .getPrivateChats()
                .stream().map(PrivateChatService::mapPrivateChatToDto).collect(Collectors.toList());
    }
//    @Transactional
//    public PrivateChatDTO createNewPrivateChat(Long currentUserId, Long otherUserId) {
//        User currentUser = userRepository.findById(currentUserId)
//                .orElseThrow(() -> new EntityNotFoundException("User not found with ID " + currentUserId + " to create private chat for"));
//        User otherUser = userRepository.findById(otherUserId)
//                .orElseThrow(() -> new EntityNotFoundException("User not found with ID " + otherUserId + " to create private chat with"));
//
//
//        currentUser.getPrivateChats().stream()
//                .filter(chat -> chat.getOtherUser().getId().equals(otherUser.getId()))
//                .findFirst()
//                .ifPresent(chat -> {
//                    throw new IllegalArgumentException("Private chat already exists between user with ID " + currentUserId + " and user with ID " + otherUserId);
//                });
//
//        PrivateChat privateChat = new PrivateChat();
//        privateChat.setCreatedAt(new Date());
//        privateChat.setUser(currentUser);
//        privateChat.setOtherUser(otherUser);
//
//        PrivateChat savedPrivateChat = privateChatRepository.save(privateChat);
////        userRepository.save(currentUser);
////        userRepository.save(otherUser);
//        return mapPrivateChatToDto(savedPrivateChat);
//    }

    @Transactional
    public PrivateChatDTO createNewPrivateChat(Long userId1, Long userId2) throws Exception {
        // Fetch users from the database
        User user1 = userRepository.findById(userId1).orElseThrow(() -> new Exception("User not found"));
        User user2 = userRepository.findById(userId2).orElseThrow(() -> new Exception("User not found"));

        // Check if there is already a chat between these two users
        Optional<PrivateChat> existingChat = privateChatRepository.findByParticipantsContainingAndParticipantsContaining(user1, user2);

        if (existingChat.isPresent()) {
            // If there is, return the existing chat
            return mapPrivateChatToDto(existingChat.get());
        } else {
            // If not, create a new chat
            PrivateChat chat = new PrivateChat();
            chat.setParticipants(Arrays.asList(user1, user2));
            chat.setCreatedAt(new Date());
            // Save the chat in the database
            return mapPrivateChatToDto(privateChatRepository.save(chat));
        }
    }

    public static PrivateChatDTO mapPrivateChatToDto(PrivateChat privateChat) {
        PrivateChatDTO privateChatDTO = new PrivateChatDTO();
        privateChatDTO.setId(privateChat.getId());
        privateChatDTO.setCreatedAt(privateChat.getCreatedAt());
        privateChatDTO.setParticipantsIds(privateChat.getParticipants().stream().map(User::getId).collect(Collectors.toList()));
//        if (privateChat.getOtherUser() != null){
//            privateChatDTO.setOtherUser(mapUserToDto(privateChat.getOtherUser()));
//        }
        privateChatDTO.setChatMessages(privateChat.getChatMessages().stream().map(PrivateChatService::mapChatMessageToDto).collect(Collectors.toList()));
        return privateChatDTO;
    }

    public static ChatMessageDTO mapChatMessageToDto(ChatMessage message) {
        ChatMessageDTO messageDTO = new ChatMessageDTO();
        messageDTO.setId(message.getId());
        messageDTO.setContent(message.getContent());
        messageDTO.setCreatedAt(message.getCreatedAt());
        if (message.getSender() != null){
            messageDTO.setSenderId(message.getSender().getId());
        }
        if (message.getFile() != null){
            messageDTO.setFileId(message.getFile().getId());
            messageDTO.setFilePath(FILES_SERVING_ENDPOINT + '/' + message.getFile().getFileName());
        }
        return messageDTO;
    }

    public void addMessageToPrivateChat(Long privateChatId, ChatMessage createdMessage) {
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new EntityNotFoundException("Private chat no found with ID " + privateChatId + " to append the message with ID " + createdMessage.getId()));
        privateChat.getChatMessages().add(createdMessage);
        privateChatRepository.save(privateChat);
    }
}