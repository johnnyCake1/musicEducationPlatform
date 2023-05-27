package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.FileDTO;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Objects;

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
    public ResponseEntity<Long> createFile(@RequestPart("file") MultipartFile file) throws IOException {
//        File savedFile;
//        try {
//            savedFile = fileService.createFile(file);
//        } catch (IOException e) {
//            return ResponseEntity.badRequest().build();
//        }
        return ResponseEntity.ok().body(fileService.createFile2(file));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileSystemResource> getFile(@PathVariable Long fileId) {
        File file = fileService.getFileById(fileId);

        return getFileSystemResourceResponseEntity(file);
    }

}
