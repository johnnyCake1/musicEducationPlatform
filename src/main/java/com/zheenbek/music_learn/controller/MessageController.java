package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.MessageDTO;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {
    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageDTO> createMessage(@RequestBody MessageDTO message) {
        MessageDTO createdMessage = messageService.createMessage(message);
        return new ResponseEntity<>(createdMessage, HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteMessage(@RequestParam Long messageId) {
        messageService.deleteById(messageId);
        return ResponseEntity.ok().body("Message successfully deleted");
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<Message>> getMessagesByConversationId(@PathVariable Long conversationId) {
        List<Message> messages = messageService.getAllByConversationId(conversationId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}
