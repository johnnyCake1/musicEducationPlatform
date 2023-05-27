package com.zheenbek.music_learn.entity;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.zheenbek.music_learn.entity.user.User;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIdentityReference(alwaysAsId = true)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonIdentityReference(alwaysAsId = true)
    private User sender;

    private String message;

    @ManyToOne
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity file;

    private Date timestamp;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public FileEntity getFile() {
        return file;
    }

    public void setFile(FileEntity file) {
        this.file = file;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

}
