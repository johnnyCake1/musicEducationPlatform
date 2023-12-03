package com.zheenbek.music_learn.entity.chat;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

@Entity
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * Each private chatroom will have two instances of chatroom object with two users
     * If we create a chatroom between user1 and user2, then it will have two instances, and they will have sender as user1 and recipient as user2 and vice-versa sender as user2 and recipient as user1
     */
    //
    //
    private String chatRoomId;
    /**
     * Each room has a name. For a private chatroom the convention is that chatroom will have recipient's username.
     */
    private String chatRoomName;
    @ManyToOne
    private ChatMessage lastMessage;
    private Long senderId;
    private Long recipientId;
    @JsonProperty(value = "img_url")
    private String chatRoomPicturePath;
    public ChatRoom() {
    }

    public ChatRoom(Long senderId, Long recipientId, String chatRoomId, String chatRoomName, String chatRoomPicturePath) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.chatRoomId = chatRoomId;
        this.chatRoomName = chatRoomName;
        this.chatRoomPicturePath = chatRoomPicturePath;
    }

    public ChatMessage getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(ChatMessage lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getChatRoomName() {
        return chatRoomName;
    }

    public void setChatRoomName(String chatRoomName) {
        this.chatRoomName = chatRoomName;
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getChatRoomPicturePath() {
        return chatRoomPicturePath;
    }

    public void setChatRoomPicturePath(String chatRoomPicture) {
        this.chatRoomPicturePath = chatRoomPicture;
    }
}
