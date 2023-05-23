package com.zheenbek.music_learn.entity;

import com.fasterxml.jackson.annotation.JsonIdentityReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity profilePic;

    @OneToMany(cascade = CascadeType.ALL)
    @JsonIdentityReference(alwaysAsId = true)
    private List<User> participants = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "conversation")
    private List<Message> messages = new ArrayList<>();

    public Conversation() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public FileEntity getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(FileEntity profilePic) {
        this.profilePic = profilePic;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }
}
