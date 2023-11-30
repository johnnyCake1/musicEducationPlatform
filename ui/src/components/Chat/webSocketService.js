// WebSocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
    }

    connect(userId, onMessageReceived) {
        console.log("trying to connect...")
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected!")
                this.subscribe(userId, onMessageReceived);
            },
            onStompError: () => {
                console.log("Stomp error!")
            },
            onWebSocketError: () => {
                console.log("WebSocket error!")
            }
        });
        this.stompClient.activate();
    }

    subscribe(userId, onMessageReceived) {
        this.stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
            console.log("message received from subscription:", message)
            onMessageReceived(JSON.parse(message.body));
        });
    }

    sendMessage(destination, message) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({ destination, body: JSON.stringify(message) });
        }
    }

    disconnect() {
        console.log("Disconnected!")

        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }
}

export const webSocketService = new WebSocketService();
