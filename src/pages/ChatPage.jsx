import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Avatar, BackButton } from "../components/ui";
import { chatAPI } from "../services/api";
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  sendTypingStart,
  sendTypingStop,
} from "../services/socket";
import {
  FaPaperPlane,
  FaSearch,
  FaArrowLeft,
  FaCircle,
  FaRegCommentDots,
  FaPlus,
  FaChevronDown,
  FaCheck,
  FaCheckDouble,
  FaSmile,
} from "react-icons/fa";

export default function ChatPage() {
  const { currentUser, showToast, students } = useApp();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const messagesEndRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const isTeacher = currentUser?.role === "teacher";

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("coined_token");
    if (token) {
      const socket = initializeSocket(token);
      
      // Listen for new messages
      socket.on("message:new", ({ message, conversationId }) => {
        // Check if message belongs to current conversation (handle both old and new format)
        const currentConvId = selectedConversation?._id;
        const msgConvId = conversationId;
        
        // Check by participant ID as fallback
        const msgPartnerId = message.sender?._id === currentUser?._id 
          ? message.receiver?._id 
          : message.sender?._id;
        
        if (currentConvId === msgConvId || currentConvId === msgPartnerId) {
          // Avoid duplicates
          setMessages((prev) => {
            const exists = prev.some(m => m._id === message._id);
            if (exists) return prev;
            return [...prev, message];
          });
        }
        // Update conversation list
        loadConversations();
      });

      // Listen for typing events
      socket.on("typing:start", ({ userId, userName, conversationId }) => {
        if (selectedConversation?._id === conversationId && userId !== currentUser?._id) {
          setTypingUsers((prev) => ({
            ...prev,
            [conversationId]: userName,
          }));
        }
      });

      socket.on("typing:stop", ({ userId, conversationId }) => {
        if (selectedConversation?._id === conversationId) {
          setTypingUsers((prev) => {
            const newTyping = { ...prev };
            delete newTyping[conversationId];
            return newTyping;
          });
        }
      });

      // Listen for online/offline events
      socket.on("user:online", ({ userId }) => {
        setOnlineUsers((prev) => new Set([...prev, userId]));
        // Update conversations online status
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            isOnline: conv.participants?.some((p) => p._id === userId) || conv.isOnline,
          }))
        );
      });

      socket.on("user:offline", ({ userId }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        // Update conversations online status
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            isOnline: conv.participants?.some((p) => p._id === userId) ? false : conv.isOnline,
          }))
        );
      });

      // Listen for read receipts
      socket.on("message:read", ({ messageId, userId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  status: "read",
                  readBy: [...(msg.readBy || []), { user: userId, readAt: new Date() }],
                }
              : msg
          )
        );
      });

      return () => {
        socket.off("message:new");
        socket.off("typing:start");
        socket.off("typing:stop");
        socket.off("user:online");
        socket.off("user:offline");
        socket.off("message:read");
      };
    }
  }, [currentUser?._id, selectedConversation?._id]);

  // Load all students for chat dropdown
  useEffect(() => {
    if (isTeacher) {
      chatAPI
        .getStudents()
        .then(setAllStudents)
        .catch((err) => {
          console.error("Failed to load students:", err);
          showToast("❌ Failed to load students for chat", "error");
        });
    }
  }, [isTeacher, showToast]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Join conversation room when selected
  useEffect(() => {
    if (selectedConversation?._id) {
      joinConversation(selectedConversation._id);
      loadMessages(selectedConversation._id);
      // Mark as read
      chatAPI.markConversationRead(selectedConversation._id).catch((err) => {
        console.error("Failed to mark conversation as read:", err);
      });
    }
    return () => {
      if (selectedConversation?._id) {
        leaveConversation(selectedConversation._id);
      }
    };
  }, [selectedConversation?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNewChatDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatAPI.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      showToast("❌ Failed to load conversations", "error");
    }
  };

  const loadMessages = async (conversationId, page = 1) => {
    if (!conversationId) return;
    if (page === 1) setLoadingMessages(true);
    try {
      const data = await chatAPI.getMessages(conversationId, page);
      if (page === 1) {
        setMessages(data.messages);
      } else {
        setMessages((prev) => [...data.messages, ...prev]);
      }
      setPagination(data.pagination);
    } catch (err) {
      if (page === 1) showToast("❌ Failed to load messages", "error");
    } finally {
      if (page === 1) setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      const message = await chatAPI.sendMessage(
        selectedConversation._id,
        newMessage
      );
      // Don't add to messages here - the socket event will handle it
      // This prevents duplicate messages
      setNewMessage("");
      // Stop typing indicator
      handleTypingStop();
      // Refresh conversations to update last message
      loadConversations();
    } catch (err) {
      showToast("❌ Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (student) => {
    try {
      // Check if conversation already exists
      const existingConv = conversations.find(
        (c) => c.participants?.some((p) => p._id === student._id)
      );

      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Create new conversation
        const newConv = await chatAPI.createConversation(student._id);
        setSelectedConversation(newConv);
        setMessages([]);
      }
      setShowNewChatDropdown(false);
      loadConversations();
    } catch (err) {
      showToast("❌ Failed to start conversation", "error");
    }
  };

  const handleTyping = useCallback(
    (text) => {
      setNewMessage(text);

      // Send typing indicator
      if (!isTypingRef.current && selectedConversation?._id) {
        isTypingRef.current = true;
        sendTypingStart(
          selectedConversation._id,
          selectedConversation.participants?.[0]?._id
        );
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        handleTypingStop();
      }, 2000);
    },
    [selectedConversation]
  );

  const handleTypingStop = () => {
    if (isTypingRef.current && selectedConversation?._id) {
      isTypingRef.current = false;
      sendTypingStop(
        selectedConversation._id,
        selectedConversation.participants?.[0]?._id
      );
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000)
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getMessageStatusIcon = (status, isMe) => {
    if (!isMe) return null;
    switch (status) {
      case "sending":
        return <FaCircle className="text-slate-400 text-xs" />;
      case "sent":
        return <FaCheck className="text-slate-400 text-xs" />;
      case "delivered":
        return <FaCheckDouble className="text-slate-400 text-xs" />;
      case "read":
        return <FaCheckDouble className="text-brand-500 text-xs" />;
      default:
        return null;
    }
  };

  // Get available students for teacher to start new conversation
  const availableStudents = isTeacher
    ? allStudents.filter(
        (s) => !conversations.find((c) => c.participants?.some((p) => p._id === s._id))
      )
    : [];

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) => {
    const name = conv.participants?.[0]?.name?.toLowerCase() || "";
    return name.includes(searchQuery.toLowerCase());
  });

  const isPartnerOnline = (conv) => {
    return conv.isOnline || onlineUsers.has(conv.participants?.[0]?._id);
  };

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} />
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl w-10 h-10">
              <FaRegCommentDots className="text-white text-lg" />
            </div>
            <div>
              <h1 className="font-poppins font-black text-slate-800 dark:text-white text-lg">
                Messages
              </h1>
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                {isTeacher ? "Chat with your students" : "Chat with your teacher"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div
          className={`w-full md:w-80 bg-white dark:bg-slate-800 flex flex-col ${
            selectedConversation ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <FaSearch className="top-1/2 left-3 absolute text-slate-400 text-sm -translate-y-1/2" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 py-2.5 pr-4 pl-9 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 w-full font-medium text-slate-800 dark:text-slate-200 text-sm"
              />
            </div>
          </div>

          {/* New Chat Button - Always show for teachers */}
          {isTeacher && (
            <div className="relative px-3 pb-2" ref={dropdownRef}>
              <button
                onClick={() => setShowNewChatDropdown(!showNewChatDropdown)}
                className="flex justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 py-2.5 rounded-xl w-full font-bold text-white text-sm transition-colors"
              >
                <FaPlus /> New Chat{" "}
                <FaChevronDown
                  className={`text-xs transition-transform ${
                    showNewChatDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {showNewChatDropdown && (
                <div className="top-full right-3 left-3 z-50 absolute bg-white dark:bg-slate-700 shadow-xl mt-1 border border-slate-200 dark:border-slate-600 rounded-xl max-h-60 overflow-y-auto">
                  {availableStudents.length > 0 ? (
                    availableStudents.map((student) => (
                      <button
                        key={student._id}
                        onClick={() => handleStartConversation(student)}
                        className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-600 p-3 w-full transition-colors"
                      >
                        <Avatar user={student} size={32} />
                        <div className="flex-1 text-left">
                          <p className="font-bold text-slate-800 dark:text-white text-sm">
                            {student.name}
                          </p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs">
                            Class {student.class}
                          </p>
                        </div>
                        {onlineUsers.has(student._id) && (
                          <FaCircle className="text-green-500 text-xs" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {allStudents.length === 0
                          ? "No students yet"
                          : "All students have chats"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-700 mx-auto mb-4 rounded-full w-16 h-16">
                  <FaRegCommentDots className="text-slate-300 dark:text-slate-500 text-2xl" />
                </div>
                <p className="font-bold text-slate-600 dark:text-slate-400">
                  No conversations yet
                </p>
                <p className="mt-1 text-slate-400 dark:text-slate-500 text-sm">
                  {isTeacher
                    ? "Start a chat with your students"
                    : "Your teacher will message you"}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv, index) => {
                const partner = conv.participants?.[0];
                const isOnline = isPartnerOnline(conv);

                return (
                  <button
                    key={conv._id || index}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 ${
                      selectedConversation?._id === conv._id
                        ? "bg-brand-50 dark:bg-brand-900/20"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar user={partner} size={48} />
                      {isOnline && (
                        <span className="right-0 bottom-0 absolute bg-green-500 border-2 border-white dark:border-slate-800 rounded-full w-3 h-3"></span>
                      )}
                      {conv.unreadCount > 0 && (
                        <span className="-top-1 -right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-5 h-5 font-bold text-white text-xs">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">
                          {partner?.name || "Unknown"}
                        </p>
                        {conv.lastMessage && (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm truncate">
                        {conv.lastMessage ? (
                          <span
                            className={
                              conv.lastMessage.isFromMe ? "font-medium" : ""
                            }
                          >
                            {conv.lastMessage.isFromMe ? "You: " : ""}
                            {conv.lastMessage.content}
                          </span>
                        ) : (
                          <span className="italic">No messages yet</span>
                        )}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex flex-col flex-1 bg-slate-50 dark:bg-slate-900">
            {/* Chat Header */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 shadow-sm p-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors"
              >
                <FaArrowLeft className="text-slate-600 dark:text-slate-300" />
              </button>
              <Avatar
                user={selectedConversation.participants?.[0]}
                size={40}
              />
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-white">
                  {selectedConversation.participants?.[0]?.name}
                </p>
                <p className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                  {isPartnerOnline(selectedConversation) ? (
                    <>
                      <span className="inline-block bg-green-500 rounded-full w-2 h-2"></span>
                      Online
                    </>
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 p-4 overflow-y-auto">
              {/* Typing Indicator */}
              {typingUsers[selectedConversation._id] && (
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="flex gap-1">
                    <span className="bg-slate-400 rounded-full w-2 h-2 animate-bounce"></span>
                    <span
                      className="bg-slate-400 rounded-full w-2 h-2 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="bg-slate-400 rounded-full w-2 h-2 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 text-sm">
                    {typingUsers[selectedConversation._id]} is typing...
                  </span>
                </div>
              )}

              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="border-brand-500 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <div className="flex justify-center items-center bg-white dark:bg-slate-800 shadow-lg mb-4 rounded-full w-20 h-20">
                    <FaRegCommentDots className="text-brand-500 text-3xl" />
                  </div>
                  <p className="font-bold text-slate-600 dark:text-slate-400">
                    No messages yet
                  </p>
                  <p className="mt-1 text-slate-400 dark:text-slate-500 text-sm">
                    Send a message to start the conversation
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender._id === currentUser._id;
                  const isTeacher = msg.sender.role === 'teacher';
                  const showAvatar =
                    index === 0 ||
                    messages[index - 1].sender._id !== msg.sender._id;

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${!isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          !isMe ? "flex-row-reverse" : ""
                        }`}
                      >
                        {!isMe && showAvatar && (
                          <Avatar user={msg.sender} size={32} />
                        )}
                        {!isMe && !showAvatar && <div className="w-8" />}
                        <div
                          className={`flex flex-col ${
                            !isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              !isMe
                                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-br-md"
                                : isTeacher
                                ? "bg-purple-500 text-white rounded-bl-md"
                                : "bg-blue-500 text-white rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-slate-400 dark:text-slate-500 text-xs">
                              {formatTime(msg.createdAt)}
                            </span>
                            {getMessageStatusIcon(msg.status, !isMe)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white dark:bg-slate-800 shadow-lg p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <FaSmile />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  onBlur={handleTypingStop}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="flex justify-center items-center bg-gradient-to-r from-brand-500 hover:from-brand-600 to-brand-600 hover:to-brand-700 disabled:opacity-50 rounded-2xl w-12 h-12 text-white active:scale-95 transition-all"
                >
                  {loading ? (
                    <div className="border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Empty State for Desktop */
          <div className="hidden md:flex flex-col flex-1 justify-center items-center bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-center items-center bg-gradient-to-br from-brand-100 dark:from-brand-900/30 to-purple-100 dark:to-purple-900/30 mb-6 rounded-full w-24 h-24">
              <FaRegCommentDots className="text-brand-500 text-4xl" />
            </div>
            <h2 className="mb-2 font-poppins font-black text-slate-800 dark:text-white text-2xl">
              Your Messages
            </h2>
            <p className="max-w-sm text-slate-500 dark:text-slate-400 text-center">
              Select a conversation from the list or start a new chat with your{" "}
              {isTeacher ? "students" : "teacher"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

