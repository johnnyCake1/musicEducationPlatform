package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.request_response.FileDTO;
import com.zheenbek.music_learn.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import static com.zheenbek.music_learn.controller.CourseController.getFileSystemResourceResponseEntity;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {
    private final FileService fileService;

    @Autowired
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    public ResponseEntity<FileDTO> createFile(@RequestPart("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok().body(fileService.createFile(file));
    }

    @PostMapping("/user-storage/{userId}/{fileId}")
    public ResponseEntity<FileDTO> saveFileForUser(@PathVariable Long fileId, @PathVariable Long userId) {
        return ResponseEntity.ok().body(fileService.saveFileToUserStorage(fileId, userId));
    }

    @DeleteMapping("/user-storage/{userId}/{fileId}")
    public ResponseEntity<FileDTO> removeFileFromUser(@PathVariable Long fileId, @PathVariable Long userId) {
        return ResponseEntity.ok().body(fileService.removeFileFromUserStorage(fileId, userId));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileSystemResource> getFile(@PathVariable Long fileId) {
        File file = fileService.getFileById(fileId);

        return getFileSystemResourceResponseEntity(file);
    }

}
