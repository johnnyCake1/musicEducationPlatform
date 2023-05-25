package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Conversation;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.ConversationRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.MessageRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Optional;
import java.util.stream.DoubleStream;

import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ServerFileStorageService serverFileStorageService;


    @Autowired
    public FileService(FileRepository fileRepository, MessageRepository messageRepository, UserRepository userRepository, ConversationRepository conversationRepository, ServerFileStorageService serverFileStorageService) {
        this.fileRepository = fileRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.serverFileStorageService = serverFileStorageService;
    }

    @Deprecated
    public void saveMessageFile(byte[] fileData, String contentType, Long conversationId, Long userId) throws IOException {
        // store in the file system
        File file = serverFileStorageService.storeMessageAttachment(fileData, contentType, String.valueOf(conversationId));
        // store in the database
        FileEntity fileEntity = fileRepository.save(fileEntityFromFile(file, contentType));
        //save as a separate message
        Message message = new Message();
        message.setFile(fileEntity);
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new EntityNotFoundException("Conversation not found with ID: " + conversationId));
        message.setConversation(conversation);
        User sender = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        message.setSender(sender);
        message.setTimestamp(new Date());

        messageRepository.save(message);
    }

    /**
     * Queries a message object that contains a file and returns it as a File object along with its media type.
     *
     * @param messageId id of the message that needs to be queried. The mentioned message is supposed to have a file within it.
     * @return a pair where first value is the file and second is its media type.
     */
    @Deprecated
    public Pair<File, String> getMessageFile(Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new EntityNotFoundException("Message not found with ID: " + messageId));
        if (message.getFile() == null) {
            throw new RuntimeException("Message with ID " + messageId + " does not contain a file");
        }
        File file = new File(message.getFile().getFilePath());
        String mediaType = message.getFile().getMediaType();
        return Pair.of(file, mediaType);
    }
}
