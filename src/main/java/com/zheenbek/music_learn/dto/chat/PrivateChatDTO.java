package com.zheenbek.music_learn.dto.chat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class PrivateChatDTO {

    private Long id;
    private List<Long> participantsIds;
    private Date createdAt;

    private List<ChatMessageDTO> chatMessages = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Long> getParticipantsIds() {
        return participantsIds;
    }

    public void setParticipantsIds(List<Long> participantsIds) {
        this.participantsIds = participantsIds;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<ChatMessageDTO> getChatMessages() {
        return chatMessages;
    }

    public void setChatMessages(List<ChatMessageDTO> chatMessages) {
        this.chatMessages = chatMessages;
    }
}

