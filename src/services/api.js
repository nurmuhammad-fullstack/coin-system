// src/services/api.js

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Helper to get full avatar URL
export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return `${BASE_URL.replace('/api', '')}${avatar}`;
};

const getHeaders = () => {
  const token = localStorage.getItem('coined_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (method, path, body = null) => {
  const url = `${BASE_URL}${path}`;
  console.log(`API Request: ${method} ${url}`, body ? JSON.stringify(body) : '');
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  console.log(`API Response: ${res.status}`, JSON.stringify(data));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Auth ─────────────────────────────────────────
export const authAPI = {
  login:         (email, password) => request('POST', '/auth/login', { email, password }),
  register:      (data)            => request('POST', '/auth/register', data),
  me:            ()                => request('GET',  '/auth/me'),
  createStudent: (data)            => request('POST', '/auth/create-student', data),
  updateProfile: (data)            => request('PUT',  '/auth/profile', data),
  uploadAvatar:  async (file)      => {
    const token = localStorage.getItem('coined_token');
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${BASE_URL}/auth/upload-avatar`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};

// ── Students ─────────────────────────────────────
export const studentsAPI = {
  getLeaderboard: ()              => request('GET',    '/students/leaderboard'),
  getAll:          ()              => request('GET',    '/students/all'),  // Changed to /all for chat
  getAllForStudents: ()            => request('GET',    '/students'),       // Original for Students page
  getOne:          (id)            => request('GET',    `/students/${id}`),
  deleteOne:       (id)            => request('DELETE', `/students/${id}`),
  getTransactions: (id)            => request('GET',    `/students/${id}/transactions`),
  addCoins:        (id, amount, label, category) =>
    request('POST', `/students/${id}/coins`, { amount, type: 'earn', label, category }),
  removeCoins:     (id, amount, label, category) =>
    request('POST', `/students/${id}/coins`, { amount, type: 'spend', label, category }),
};

// ── Shop ─────────────────────────────────────────
export const shopAPI = {
  getAll:    ()     => request('GET',    '/shop'),
  addItem:   (item) => request('POST',   '/shop', item),
  deleteItem:(id)   => request('DELETE', `/shop/${id}`),
  buyItem:   (id)   => request('POST',   `/shop/${id}/buy`),
};

// ── Quizzes ──────────────────────────────────────
export const quizzesAPI = {
  getAll:        ()                        => request('GET',    '/quizzes'),
  getOne:        (id)                      => request('GET',    `/quizzes/${id}`),
  create:        (data)                    => request('POST',   '/quizzes', data),
  update:        (id, data)                => request('PUT',    `/quizzes/${id}`, data),
  delete:        (id)                      => request('DELETE', `/quizzes/${id}`),
  getResults:    (id)                      => request('GET',    `/quizzes/${id}/results`),
  toggle:        (id)                      => request('PATCH',  `/quizzes/${id}/toggle`),
  submitAttempt: (id, answers, timeTaken)  => request('POST',   `/quizzes/${id}/submit`, { answers, timeTaken }),
  myAttempts:    ()                        => request('GET',    '/quizzes/my-attempts'),
};

// ── Notifications ────────────────────────────────
export const notificationsAPI = {
  getAll:         ()               => request('GET',    '/notifications'),
  getUnreadCount: ()              => request('GET',    '/notifications/unread-count'),
  markAsRead:     (id)            => request('PUT',    `/notifications/${id}/read`),
  markAllAsRead:  ()               => request('PUT',    '/notifications/read-all'),
  delete:         (id)             => request('DELETE', `/notifications/${id}`),
  clearAll:       ()               => request('DELETE', '/notifications/clear-all'),
};

// ── Classes ──────────────────────────────────────
export const classesAPI = {
  getAll:     ()               => request('GET',    '/classes'),
  getForStudent: ()            => request('GET',   '/classes/student'),
  create:     (data)           => request('POST',  '/classes', data),
  update:     (id, data)       => request('PUT',   `/classes/${id}`, data),
  delete:     (id)             => request('DELETE', `/classes/${id}`),
};

// ── Analytics ────────────────────────────────────
export const analyticsAPI = {
  getOverview:  ()             => request('GET',    '/analytics/overview'),
  getQuizzes:   ()             => request('GET',    '/analytics/quizzes'),
  getStudents:  ()             => request('GET',    '/analytics/students'),
  getCoins:     ()             => request('GET',    '/analytics/coins'),
  getShop:       ()             => request('GET',    '/analytics/shop'),
  getClasses:    ()             => request('GET',    '/analytics/classes'),
};

// ── Chat ─────────────────────────────────────────
export const chatAPI = {
  // Conversations
  getConversations: ()              => request('GET',    '/chat/conversations'),
  createConversation: (partnerId)   => request('POST',  '/chat/conversations', { partnerId }),
  getConversation: (conversationId) => request('GET',   `/chat/conversations/${conversationId}`),
  markConversationRead: (conversationId) => request('PUT', `/chat/conversations/${conversationId}/read`),
  
  // Messages
  getMessages: (conversationId, page = 1, limit = 50) => 
    request('GET',    `/chat/messages/${conversationId}?page=${page}&limit=${limit}`),
  sendMessage: (conversationId, content, type = 'text', attachment = null, replyTo = null) => 
    request('POST',   `/chat/messages/${conversationId}`, { content, type, attachment, replyTo }),
  markMessageRead: (messageId)      => request('PUT',   `/chat/messages/${messageId}/read`),
  addReaction: (messageId, emoji)   => request('POST',  `/chat/messages/${messageId}/reaction`, { emoji }),
  deleteMessage: (messageId)       => request('DELETE', `/chat/messages/${messageId}`),
  
  // Utilities
  getUnreadCount: ()                => request('GET',   '/chat/unread'),
  getStudents: ()                   => request('GET',   '/chat/students'),
};

// ── Contact / Email Support ───────────────────────
export const contactAPI = {
  sendEmail: (name, email, subject, message) => 
    request('POST', '/contact/email', { name, email, subject, message }),
  getContactInfo: () => request('GET', '/contact'),
};
