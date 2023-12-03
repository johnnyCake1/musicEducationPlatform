// ChatComponent.js
import React, { useState, useEffect } from 'react';
import { webSocketService } from '../../services/webSocketService';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import { useLocation, useParams } from 'react-router-dom';
import ChatRoomList from './components/ChatRoomList';
import "./ChatComponent.css"

const ChatComponent = () => {
    const location = useLocation();
    // Get the query string from the location
    // Parse the query string into an object
    const queryParams = new URLSearchParams(location.search);
    // Access the initial active chat through query parameters
    const otherUserIdQueryParam = queryParams.get('otherUserId');

    const [recipientUserId, setRecipientUserId] = useState(otherUserIdQueryParam);
    const [currentUser] = useLocalStorageState(null, "currentUser");
    const [jwt] = useLocalStorageState("", "jwt");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        //retrieve existing messages
        httpReqAsync(`/api/v1/messages/${currentUser.id}/${recipientUserId}`, "GET", jwt).then((result) => {
            console.log("I got the messages:", result);
            setMessages(result ?? []);
        }).catch(err => {
            console.log("Couldn't fetch messages for this chatroom")
        });

        //connect to proper web socket
        webSocketService.connect(currentUser.id, (message) => {
            console.log("info received after connection:", message);
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            webSocketService.disconnect();
        };
    }, [currentUser.id, recipientUserId]);

    const sendMessage = () => {
        const timestamp = new Date(); // Current time
        const messageToSend = {
            content: newMessage,
            senderId: currentUser.id,
            recipientId: recipientUserId,
            timestamp: timestamp.toISOString() // ISO 8601 format
        };
        webSocketService.sendMessage(`/app/chat`, messageToSend);
        setMessages((prevMessages) => [...prevMessages, messageToSend]); // Optimistically update the UI without ensuring that it reached the backend and got saved successfully
        setNewMessage('');
    };

    return (
        <div className="chat-component">
            <div className="chat-room-list">
                <ChatRoomList handleSetActiveChatUserId={setRecipientUserId}/>
            </div>
            {recipientUserId ?
                <div className="active-chat">
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>{msg.content}</li>
                        ))}
                    </ul>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                </div> 
                : 
                <div className='active-chat'> Chat not chosen</div>
            }
        </div>
    );
};

export default ChatComponent;
