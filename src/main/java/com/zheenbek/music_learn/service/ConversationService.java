package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.ConversationDTO;
import com.zheenbek.music_learn.dto.MessageDTO;
import com.zheenbek.music_learn.dto.user.UserDTO;
import com.zheenbek.music_learn.entity.Conversation;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.course.ConversationRepository;
import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository,
                               UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public List<ConversationDTO> getAllConversations() {
        List<Conversation> conversations = conversationRepository.findAll();

        return conversations.stream()
                .map(this::mapConversationToDTO)
                .collect(Collectors.toList());
    }

    public ConversationDTO getConversationById(Long conversationId) {
        return mapConversationToDTO(conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with ID: " + conversationId)));
    }

    public List<ConversationDTO> getAllConversationsByUserId(Long userId) {
        return conversationRepository
                .findByParticipantsId(userId).stream()
                .map(this::mapConversationToDTO)
                .collect(Collectors.toList());
    }

    public Long createConversation(Long[] participantsIds) {
        Conversation conversation = new Conversation();
        List<User> participants = new ArrayList<>();
        for (Long userId : participantsIds) {
            participants.add(userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId)));
        }
        conversation.setParticipants(participants);
        return conversationRepository.save(conversation).getId();
    }

    public Optional<Conversation> findById(Long conversationId) {
        return conversationRepository.findById(conversationId);
    }

    private ConversationDTO mapConversationToDTO(Conversation conversation) {
        ConversationDTO conversationDTO = new ConversationDTO();
        conversationDTO.setId(conversation.getId());
        conversationDTO.setName(conversation.getName());
        conversationDTO.setParticipantsIds(conversation.getParticipants().stream().map(User::getId).collect(Collectors.toList()));
        List<MessageDTO> messageDTOs = conversation.getMessages().stream()
                .map(this::mapMessageToDTO)
                .collect(Collectors.toList());

        conversationDTO.setMessages(messageDTOs);

        return conversationDTO;
    }

    private MessageDTO mapMessageToDTO(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        if (message.getFile() != null){
            messageDTO.setFileId(message.getFile().getId());
        }
        messageDTO.setId(message.getId());
        messageDTO.setConversationId(message.getConversation().getId());
        User sender = message.getSender();
        UserDTO senderDTO = new UserDTO();
        senderDTO.setId(sender.getId());
        senderDTO.setUsername(sender.getUsername());
        senderDTO.setStartDate(sender.getStartDate());

        messageDTO.setSenderId(senderDTO.getId());
        messageDTO.setMessage(message.getMessage());
        messageDTO.setTimestamp(formatTimestamp(message.getTimestamp()));

        return messageDTO;
    }

    private String formatTimestamp(Date timestamp) {
        LocalDateTime localDateTime = LocalDateTime.ofInstant(timestamp.toInstant(), ZoneOffset.UTC);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return localDateTime.format(formatter);
    }
}
