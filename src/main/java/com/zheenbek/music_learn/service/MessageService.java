package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.MessageDTO;
import com.zheenbek.music_learn.entity.Conversation;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.course.ConversationRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final FileRepository fileRepository;
    private final ServerFileStorageService serverFileStorageService;

    @Autowired
    public MessageService(MessageRepository messageRepository, ConversationRepository conversationRepository,
                          FileRepository fileRepository, ServerFileStorageService serverFileStorageService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.fileRepository = fileRepository;
        this.serverFileStorageService = serverFileStorageService;
    }

    public MessageDTO createMessage(MessageDTO messageDTO) throws RuntimeException {
        Conversation conversation = conversationRepository.findById(messageDTO.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found with ID: " + messageDTO.getConversationId()));

        User sender = new User();
        sender.setId(messageDTO.getSenderId());

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setMessage(messageDTO.getMessage());
        // Set the timestamp as needed (control the timezone)
        message.setTimestamp(new Date());

        Message savedMessage = messageRepository.save(message);
        messageDTO.setId(savedMessage.getId());

        return messageDTO;
    }

    public Message createMessage(Message message) throws RuntimeException {
        return messageRepository.save(message);
    }

    public List<Message> getAllByConversationId(Long conversationId) {
        return messageRepository.findAllByConversationId(conversationId);
    }

    public Optional<Message> findMessageById(Long messageId) {
        return messageRepository.findById(messageId);
    }

    public void deleteById(Long messageId) {
        FileEntity file = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with ID: " + messageId))
                .getFile();
        if (file != null){
            serverFileStorageService.deleteMessageAttachment(file.getFileName());
            fileRepository.deleteById(file.getId());
        }
        messageRepository.deleteById(messageId);
    }
}
