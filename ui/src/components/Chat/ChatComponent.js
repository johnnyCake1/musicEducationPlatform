// ChatComponent.js
import React, { useState, useEffect } from 'react';
import { webSocketService } from './webSocketService';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';

const ChatComponent = () => {
    const [currentUser] = useLocalStorageState(null, "currentUser");
    const [jwt] = useLocalStorageState("", "jwt");

    console.log("current user:", currentUser);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const otherUserId = currentUser.id === 1 ? 3 : 1; // Send to user 3 if current user is 1, and vice versa

    useEffect(() => {
        //retrieve existing messages
        httpReqAsync(`/api/v1/messages/${currentUser.id}/${otherUserId}`, "GET", jwt).then((result) => {
            console.log("I got the messages:", result);
            setMessages(result);
          });

        //connect to proper web socket
        webSocketService.connect(currentUser.id, (message) => {
            console.log("info received after connection:", message);
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            webSocketService.disconnect();
        };
    }, [webSocketService, currentUser.id]);

    const sendMessage = () => {
        const timestamp = new Date(); // Current time
        const messageToSend = { 
            content: newMessage, 
            senderId: currentUser.id, 
            recipientId: otherUserId,
            timestamp: timestamp.toISOString() // ISO 8601 format
        };
        webSocketService.sendMessage(`/app/chat`, messageToSend);
        setMessages((prevMessages) => [...prevMessages, messageToSend]); // Optimistically update the UI without ensuring that it reached the backend and got saved successfully
        setNewMessage('');
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.content}</li>
                ))}
            </ul>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
