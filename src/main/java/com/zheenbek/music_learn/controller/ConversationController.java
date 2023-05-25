package com.zheenbek.music_learn.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zheenbek.music_learn.dto.ConversationDTO;
import com.zheenbek.music_learn.dto.MessageDTO;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public ResponseEntity<List<ConversationDTO>> getAllConversations(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            return new ResponseEntity<>(conversationService.getAllConversations(), HttpStatus.OK);
        }
        return new ResponseEntity<>(conversationService.getAllConversationsByUserId(userId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Long> createConversation(@RequestParam Long[] participantsIds) {
        Long createdId = conversationService.createConversation(participantsIds);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversation(@PathVariable Long conversationId) {
        return new ResponseEntity<>(conversationService.getConversationById(conversationId), HttpStatus.OK);
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<FileSystemResource> createMessage(@RequestPart(value = "file", required = false) MultipartFile file, @RequestPart(value = "message", required = false) String messageJson, @PathVariable Long conversationId) {
        MessageDTO message;
        try {
            message = new ObjectMapper().readValue(messageJson, MessageDTO.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/{conversationId}/messages/{messageId/")
//    public ResponseEntity<FileSystemResource> getMessage(@PathVariable String conversationId) {
//        MessageDTO message;
//        try {
//            message = new ObjectMapper().readValue(messageJson, MessageDTO.class);
//        } catch (JsonProcessingException e) {
//            return ResponseEntity.badRequest().build();
//        }
//
//        return ResponseEntity.noContent().build();
//    }

}
