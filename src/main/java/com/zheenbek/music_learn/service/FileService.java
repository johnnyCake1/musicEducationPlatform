package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.dto.request_response.FileDTO;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.repository.FileRepository;
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
    private final ServerFileStorageService serverFileStorageService;

    public static String FILES_SERVING_ENDPOINT;
    @Value("${files-endpoint}")
    private String filesEndpoint;
    @PostConstruct
    private void init() {
        FILES_SERVING_ENDPOINT = filesEndpoint;
    }


    @Autowired
    public FileService(FileRepository fileRepository, ServerFileStorageService serverFileStorageService) {
        this.fileRepository = fileRepository;
        this.serverFileStorageService = serverFileStorageService;
    }

    public FileDTO createFile(MultipartFile file) throws IOException {
        //save in the system:
        File storedFile = serverFileStorageService.storeFile(file, file.getOriginalFilename());
        //save in the database:
        System.out.println("File: " + file);
        System.out.println("Media type: " + file.getContentType());
        System.out.println("original name: " + file.getOriginalFilename());
        FileEntity fileEntity = fileEntityFromFile(storedFile, file.getContentType());
        return mapFileEntityToDto(fileRepository.save(fileEntity));
    }

    public File getFileById(Long fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId).orElseThrow(() -> new EntityNotFoundException("File not found with ID: " + fileId));
        return new File(fileEntity.getFilePath());
    }

    public static FileDTO mapFileEntityToDto(FileEntity fileEntity){
        FileDTO fileDTO = new FileDTO();
        fileDTO.setId(fileEntity.getId());
        if (fileEntity.getFilePath() != null && fileEntity.getFileName() != null) {
            fileDTO.setFilePath(FILES_SERVING_ENDPOINT + '/' + fileEntity.getFileName());
        }
        fileDTO.setMediaType(fileEntity.getMediaType());
        return fileDTO;
    }
}
