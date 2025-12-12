// src/services/stompClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const createStompClient = ({ url, token, onConnect, onMessage }) => {
  // url e.g. "http://localhost:8080/ws" (Spring SockJS endpoint)
  const client = new Client({
    webSocketFactory: () => new SockJS(url),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    debug: (str) => {
      // console.debug(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: (frame) => {
      onConnect && onConnect(frame, client);
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Details: " + frame.body);
    },
    onWebSocketError: (evt) => {
      console.error("WebSocket error", evt);
    },
  });

  stompClient = client;
  client.activate();
  return client;
};

export const disconnectStomp = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const getStompClient = () => stompClient;
