package com.zheenbek.music_learn.controller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/storage")
public class FileController {
    private final FileService fileService;

    @Autowired
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }



    @PostMapping("/messageFile")
    public ResponseEntity<String> sendMessageFile(@RequestBody byte[] fileData, @RequestHeader("Content-Type") String contentType, @RequestParam Long conversationId, @RequestParam Long userId) {
        if (fileData == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("file is missing in file upload request");
        }
        //TODO: validate so that only allowed media files can be saved
        try {
            fileService.saveMessageFile(fileData, contentType, conversationId, userId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("failed to save the profile picture.");
        }
        return ResponseEntity.ok("Profile picture is successfully uploaded");
    }

    @GetMapping("/messageFile")
    public ResponseEntity<FileSystemResource> getMessageFile(@RequestParam Long messageId) {
        Pair <File, String> result = fileService.getMessageFile(messageId);
        FileSystemResource resource = new FileSystemResource(result.getFirst());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(result.getSecond()));
        return ResponseEntity.ok().headers(headers).body(resource);
    }

}
