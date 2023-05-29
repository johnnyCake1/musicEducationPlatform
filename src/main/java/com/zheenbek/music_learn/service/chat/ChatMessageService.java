package com.zheenbek.music_learn.service.chat;

import com.zheenbek.music_learn.dto.chat.ChatMessageDTO;
import com.zheenbek.music_learn.entity.chat.ChatMessage;
import com.zheenbek.music_learn.entity.chat.PrivateChat;
import com.zheenbek.music_learn.repository.chat.ChatMessageRepository;
import com.zheenbek.music_learn.repository.chat.PrivateChatRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import static com.zheenbek.music_learn.service.chat.PrivateChatService.mapChatMessageToDto;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final PrivateChatRepository privateChatRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, PrivateChatRepository privateChatRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.privateChatRepository = privateChatRepository;
    }

    @Transactional
    public ChatMessageDTO saveChatMessage(ChatMessage chatMessage, Long privateChatId) {
        // Fetch the PrivateChat instance first
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new EntityNotFoundException("Private chat no found with ID " + privateChatId));
        // Save the ChatMessage
        chatMessage.setPrivateChat(privateChat);
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage); // THIS IS WHERE THE ERROR HAPPENS
        // Add the ChatMessage to the PrivateChat
        privateChat.getChatMessages().add(savedMessage);
        // Save the PrivateChat
        privateChatRepository.save(privateChat);


        return mapChatMessageToDto(savedMessage);
    }

    //chat room

//    @Transactional
//    public ChatMessageDTO saveChatMessage(ChatMessage chatMessage, Long privateChatId) {
//        // Fetch the PrivateChat instance first
//        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
//                .orElseThrow(() -> new EntityNotFoundException("Private chat no found with ID " + privateChatId));
//        // Save the ChatMessage
//        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
//        // Set the PrivateChat on the saved ChatMessage
//        savedMessage.setPrivateChat(privateChat);
//        // Save the ChatMessage again
//        savedMessage = chatMessageRepository.save(savedMessage);
//        // Add the ChatMessage to the PrivateChat
//        privateChat.getChatMessages().add(savedMessage);
//        // Save the PrivateChat
//        privateChatRepository.save(privateChat);
//
//        return mapChatMessageToDto(savedMessage);
//    }





    public ChatMessage createNewPrivateMessage(ChatMessage chatMessage, Long privateChatId){
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new EntityNotFoundException(""));
        ChatMessage savedChatMessage = chatMessageRepository.save(chatMessage);
        if (!privateChat.getChatMessages().contains(savedChatMessage)){
            privateChat.getChatMessages().add(savedChatMessage);
        }
        privateChatRepository.save(privateChat);
        return savedChatMessage;
    }

}