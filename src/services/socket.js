import { io } from 'socket.io-client';

let socket = null;

// Get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token || '';
};

// Initialize socket connection
export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io('http://localhost:5001', {
    auth: {
      token: token || getToken()
    },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected!');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected!');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
};

// Get socket instance
export const getSocket = () => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Join conversation room
export const joinConversation = (conversationId) => {
  if (socket) {
    socket.emit('conversation:join', conversationId);
  }
};

// Leave conversation room
export const leaveConversation = (conversationId) => {
  if (socket) {
    socket.emit('conversation:leave', conversationId);
  }
};

// Send typing start
export const sendTypingStart = (conversationId, partnerId) => {
  if (socket) {
    socket.emit('typing:start', { conversationId, partnerId });
  }
};

// Send typing stop
export const sendTypingStop = (conversationId, partnerId) => {
  if (socket) {
    socket.emit('typing:stop', { conversationId, partnerId });
  }
};

// Emit message send event
export const emitMessageSend = (conversationId, message) => {
  if (socket) {
    socket.emit('message:send', { conversationId, message });
  }
};

// Emit message read event
export const emitMessageRead = (conversationId, messageId, userId) => {
  if (socket) {
    socket.emit('message:read', { conversationId, messageId, userId });
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  sendTypingStart,
  sendTypingStop,
  emitMessageSend,
  emitMessageRead
};

