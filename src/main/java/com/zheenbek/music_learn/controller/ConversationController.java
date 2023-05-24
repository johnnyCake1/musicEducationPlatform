package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.ConversationDTO;
import com.zheenbek.music_learn.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        if (userId == null){
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

}
