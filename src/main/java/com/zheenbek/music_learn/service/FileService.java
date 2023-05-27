package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.repository.ConversationRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.MessageRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;

import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ServerFileStorageService serverFileStorageService;

    public static String FILES_SERVING_ENDPOINT;
    @Value("${files-endpoint}")
    private String filesEndpoint;
    @PostConstruct
    private void init() {
        FILES_SERVING_ENDPOINT = filesEndpoint;
    }


    @Autowired
    public FileService(FileRepository fileRepository, MessageRepository messageRepository, UserRepository userRepository, ConversationRepository conversationRepository, ServerFileStorageService serverFileStorageService) {
        this.fileRepository = fileRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.serverFileStorageService = serverFileStorageService;
    }

    public FileEntity createFile(MultipartFile file) throws IOException {
        //save in the system:
        File storedFile = serverFileStorageService.storeFile(file, file.getOriginalFilename());
        //save in the database:
        FileEntity fileEntity = fileEntityFromFile(storedFile, file.getContentType());
        return fileRepository.save(fileEntity);
    }

    public File getFileById(Long fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId).orElseThrow(() -> new EntityNotFoundException("File not found with ID: " + fileId));
        return new File(fileEntity.getFilePath());
    }
}
