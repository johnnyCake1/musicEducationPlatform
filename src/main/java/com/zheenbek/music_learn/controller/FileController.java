package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.request_response.FileDTO;
import com.zheenbek.music_learn.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/{fileId}")
    public ResponseEntity<FileSystemResource> getFile(@PathVariable Long fileId) {
        File file = fileService.getFileById(fileId);

        return getFileSystemResourceResponseEntity(file);
    }

}
