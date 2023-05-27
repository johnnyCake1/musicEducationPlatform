package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Conversation;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.entity.user.User;
import com.zheenbek.music_learn.repository.ConversationRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.MessageRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.util.Date;

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

    public File createFile(MultipartFile file) throws IOException {
        //save in the system:
        File storedFile = serverFileStorageService.storeCourseFile(file.getBytes(), file.getContentType(), file.getOriginalFilename());
        //save in the database:
        FileEntity fileEntity = fileRepository.save(fileEntityFromFile(storedFile, file.getContentType()));
        return new File(fileEntity.getFilePath());
    }

    public Long createFile2(MultipartFile file) throws IOException {
        //save in the system:
        File storedFile = serverFileStorageService.storeCourseFile(file.getBytes(), file.getContentType(), file.getOriginalFilename());
        //save in the database:
        return fileRepository.save(fileEntityFromFile(storedFile, file.getContentType())).getId();
    }

    public File getFileById(Long fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId).orElseThrow(() -> new EntityNotFoundException("File not found with ID: " + fileId));
        return new File(fileEntity.getFilePath());
    }
}
