package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.dto.ConversationDTO;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @PostMapping
    public ResponseEntity<Long> createConversation(@RequestParam Long[] participantsIds) {
        Long createdId = conversationService.createConversation(participantsIds);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

//    @PostMapping
//    public ResponseEntity<ConversationDTO> createConversation(@RequestBody ConversationDTO conversation) {
//        //set the defaults for the missing values
//        if (conversation.getProfilePic() == null) {
//            conversation.setProfilePic(defaultProfilePic);
//        }
//        ConversationDTO createdConversation = conversationService.createConversation(conversation);
//        return new ResponseEntity<>(createdConversation, HttpStatus.CREATED);
//    }

    @GetMapping
    public ResponseEntity<List<ConversationDTO>> getAllConversations(@RequestParam(required = false) Long userId) {
        List<ConversationDTO> conversations;
        if (userId == null){
            return new ResponseEntity<>(conversationService.getAllConversations(), HttpStatus.OK);
        }
        return new ResponseEntity<>(conversationService.getAllConversationsById(userId), HttpStatus.OK);
    }

}
