package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.chat.PrivateChatDTO;
import com.zheenbek.music_learn.service.chat.PrivateChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
public class ChatController {
    private final PrivateChatService privateChatService;

    @Autowired
    public ChatController(PrivateChatService privateChatService) {
        this.privateChatService = privateChatService;
    }


    @GetMapping("/private-chats/{currentUserId}")
    public ResponseEntity<List<PrivateChatDTO>> getUserPrivateChats(@PathVariable Long currentUserId) {
        List<PrivateChatDTO> privateChatDTO = privateChatService.getUserPrivateChats(currentUserId);
        return new ResponseEntity<>(privateChatDTO, HttpStatus.CREATED);
    }

    @PostMapping("/private-chats/{currentUserId}/{otherUserId}")
    public ResponseEntity<PrivateChatDTO> createConversation(@PathVariable Long currentUserId, @PathVariable Long otherUserId) throws Exception {
        PrivateChatDTO privateChatDTO = privateChatService.createNewPrivateChat(currentUserId, otherUserId);
        return new ResponseEntity<>(privateChatDTO, HttpStatus.CREATED);
    }
}
