// WebSocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from '../constants';

class WebSocketService {
  constructor() {
    this.stompClient = null;
  }

  connect(recipientId, senderId, onMessageReceived, onRoomsReceived) {
    console.log('Trying to connect...');
    const socket = new SockJS(`${API_URL}/ws`);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        this.subscribeToChatrooms(recipientId, onRoomsReceived);
        if (senderId) {
          this.subscribeToMessages(recipientId, senderId, onMessageReceived);
        }
        console.log('Connected!');
      },
      onStompError: () => {
        console.log('Stomp error!');
      },
      onWebSocketError: () => {
        console.log('WebSocket error!');
      },
    });
    this.stompClient.activate();
  }

  subscribeToMessages(recipientId, senderId, onMessageReceived) {
    console.log('Subscribing to messages...', senderId, recipientId);
    this.stompClient.subscribe(
      `/user/${recipientId}/queue/messages`,
      (messages) => {
        console.log('Messages received:', JSON.parse(messages.body));
        onMessageReceived(JSON.parse(messages.body));
      },
      { senderId: senderId, recipientId: recipientId }
    );
  }

  subscribeToChatrooms(recipientId, onRoomsReceived) {
    this.stompClient.subscribe(
      `/user/${recipientId}/queue/chatrooms`,
      (chatrooms) => {
        onRoomsReceived(JSON.parse(chatrooms.body));
        console.log('Chatrooms received:', JSON.parse(chatrooms.body));
      },
      { recipientId: recipientId }
    );
  }

  sendMessage(destination, message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({ destination, body: JSON.stringify(message) });
    }
  }

  disconnect() {
    console.log('Disconnected!');

    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}

export const webSocketService = new WebSocketService();
